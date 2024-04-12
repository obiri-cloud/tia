"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewLabForm from "./new-lab-form";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmation from "../delete-confirmation";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getLabListX } from "./overview";
import { setLabCount, setLabList } from "@/redux/reducers/adminSlice";
import { ILabList } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

const Labs = () => {
  const { labCount, labList } = useSelector((state: RootState) => state.admin);

  const [currentLab, setCurrentLab] = useState<ILabList | null>(null);

  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const endLab = async (id: number | undefined) => {
    toast({
      title: "Hold on we are cleaning your lab environment.",
    });
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/moderator/lab/${id}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      
      if (response.status === 204 ) {
        toast({
          title: "Lab Deleted Successfully...",
          variant: "success",
        });

        getLabListX(token).then((response) => {
          dispatch(setLabCount(response.data.count));
          dispatch(setLabList(response.data.results));
          document.getElementById("closeDialog")?.click();
        });
      } else {
        toast({
          title: "Something went wrong. Try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong. Try again",
        variant: "destructive",
      });
      console.error(error);
    } finally {
    }
  };
  return (
    <div className="space-y-4">
      {/* <Dialog> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lab</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Lab List</CardTitle>
              <CardDescription>
                {/* You have {labCount} image(s). */}
              </CardDescription>
            </div>
            {/* <DialogTrigger onClick={() => setCurrentLab(null)}>
                <Button>Add Lab</Button>
              </DialogTrigger> */}
          </CardHeader>
          <CardContent className="pl-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-center">Image</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              {labList?.length === 0 && (
                <TableCaption>No labs found...</TableCaption>
              )}
              <TableBody>
                {labList
                  ? labList.length
                    ? labList.map((image: ILabList, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {image.name}
                          </TableCell>
                          <TableCell>{image.status}</TableCell>
                          <TableCell>{image.creation_date}</TableCell>
                          <TableCell className="text-center">
                            {image.image}
                          </TableCell>
                          <TableCell className="underline font-medium text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVerticalIcon className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="left-[-20px_!important]">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setIsOpenViewDialog(true);
                                    setCurrentLab(image);
                                  }}
                                  className="cursor-pointer py-2"
                                >
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setIsOpenDeleteDialog(true);
                                    setCurrentLab(image);
                                  }}
                                  className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                           
                          </TableCell>
                        </TableRow>
                      ))
                    : null
                  : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={isOpenViewDialogOpen}
        onOpenChange={
          isOpenViewDialogOpen ? setIsOpenViewDialog : setIsOpenDeleteDialog
        }
      >
        <NewLabForm labDetails={currentLab} />
      </Dialog>

      <Dialog
        open={isOpenDeleteDialogOpen}
        onOpenChange={
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          //@ts-ignore
          lab={currentLab}
          text="Do you want to delete this image"
          noText="No"
          confirmText="Yes, Delete this image"
          confirmFunc={() => endLab(currentLab?.id)}
        />
      </Dialog>
    </div>
  );
};

export default Labs;
