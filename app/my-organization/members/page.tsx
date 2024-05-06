"use client";
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useQuery } from "react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import NewImageForm from "./new-image-form";
import NewImageForm from "@/app/components/admin/new-image-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "@/components/ui/use-toast";
// import { getImageListX } from "./overview";

import { getImageListX } from "@/app/components/admin/overview";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
// import DeleteConfirmation from "../delete-confirmation";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter, useSearchParams } from "next/navigation";
import { ILabImage } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

const Images = () => {

  const [imageList, setimagelist] = useState<any>();
  const [status, setstatus] = useState<boolean>(false);

  const { data: session } = useSession();


  const [image, setImage] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);

 

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/members/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 204) {
        setstatus(true);
        return;
      }
      console.log({ response: response.data.data });
      setimagelist(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const deletelink = async (data: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/member/${data}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 204) {
        toast({
          variant: "success",
          title: "Invitation Deleted Sucessfully",
          description: response.data.data,
        });
        setIsOpenViewDialog(false);
        getImages();
      }

      console.log({ response });
      setimagelist(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  console.log({ image });

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organzation</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        {
          //@ts-ignore
          session?.user && session?.user.data.is_admin ? (
            <Link href="/dashboard" className="font-medium text-mint">
              Go to dashboard
            </Link>
          ) : null
        }
      </div>
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <div>
              <Button className="m-4">Invite members</Button>
            </div>
          </CardHeader>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Email</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {imageList?.length === 0 ||
                  (status && (
                    <TableCaption>
                      No Members Found In This Organization
                      <br />
                      <Button
                        className="m-4"
                        onClick={() => setIsOpenViewDialog(true)}
                      >
                        invite members
                      </Button>
                    </TableCaption>
                  ))}
                <TableBody>
                  {imageList
                    ? imageList.length > 0
                      ? imageList.map((image: any, i: any) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.member.email}
                            </TableCell>
                            <TableCell>{image.member.first_name}</TableCell>
                            <TableCell>{image.invitation_status}</TableCell>
                            <TableCell className="text-right">
                              {image.port_number}
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
                                    }}
                                    className="cursor-pointer py-2"
                                  >
                                    Add to group
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsOpenDeleteDialog(true);
                                      setImage(image);
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
          </Dialog>
        </Card>
      </div>

      <Dialog
        open={isOpenDeleteDialogOpen}
        onOpenChange={
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          image={image}
          text={`Do you want to delete ${image?.member.first_name} from your organizatio`}
          noText="No"
          confirmText="Yes, Delete "
          confirmFunc={() => deletelink(image?.member.id)}
        />
      </Dialog>
    </div>
  );
};

export default Images;

