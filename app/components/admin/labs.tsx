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

const Labs = () => {
  const { labCount, labList } = useSelector((state: RootState) => state.admin);

  const [currentLab, setCurrentLab] = useState<ILabList | null>(null);

  const dispatch = useDispatch()

  const { data: session } = useSession();


  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const endLab = async (id: number | undefined) => {
    let formData = JSON.stringify({ image: id });
    toast({
      title: "Hold on we are cleaning your lab environment.",
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/delete/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 200) {
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
                            <Dialog>
                              <DialogTrigger
                                onClick={() => setCurrentLab(image)}
                              >
                                <Button className="font-medium" variant="link">
                                  View
                                </Button>
                              </DialogTrigger>
                              <NewLabForm labDetails={currentLab} />
                            </Dialog>
                            |
                            <Dialog>
                              <DialogTrigger>
                                <Button
                                  className="font-medium text-red-500"
                                  variant="link"
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DeleteConfirmation
                                //@ts-ignore
                                lab={currentLab}
                                text="Do you want to delete this image"
                                noText="No"
                                confirmText="Yes, Delete this image"
                                confirmFunc={() => endLab(image?.image)}
                              />
                            </Dialog>
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
      {/* </Dialog> */}
    </div>
  );
};

export default Labs;
