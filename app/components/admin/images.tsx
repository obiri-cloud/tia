"use client";
import React, { useState } from "react";
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
import NewImageForm from "./new-image-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "@/components/ui/use-toast";
import { getImageListX } from "./overview";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
import DeleteConfirmation from "../delete-confirmation";
import { useRouter } from "next/navigation";
import { ILabImage } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useQuery } from "react-query";
import apiClient from "@/lib/request";

const Images = () => {
  const { imageCount, imageList } = useSelector(
    (state: RootState) => state.admin
  );

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const deleteImage = async (id: number | undefined) => {
    let axiosConfig = {
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${id}/delete/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(axiosConfig);

      if (response.status === 204) {
        toast({
          variant: "success",
          title: "Image Deletion",
          description: "Image deleted successfully",
        });

        getImageListX(token).then((response) => {
          dispatch(setImageCount(response.data.count));
          dispatch(setImageList(response.data.data));
          document.getElementById("closeDialog")?.click();
        });
      } else {
        toast({
          variant: "destructive",
          title: "Image Deletion  Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Image Deletion  Error",
        description: "Something went wrong",
      });
    } finally {
      // setDisabled(false);
    }
  };

  const getTags = () => {
    const request = apiClient.get("/moderator/tags/");
    console.log("request", request);
    return request;
  };

  const { data: tags } = useQuery(["tags"], () => getTags());

  console.log("tags", tags);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageCount}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Image List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <Dialog>
              <AddButton />
              <NewImageForm />
            </Dialog>
          </CardHeader>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Difficulty Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Port Number</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {imageList?.length === 0 && (
                  <TableCaption>No images found...</TableCaption>
                )}
                <TableBody>
                  {imageList
                    ? imageList.length > 0
                      ? imageList.map((image, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.name}
                            </TableCell>
                            <TableCell>{image.difficulty_level}</TableCell>
                            <TableCell>{image.duration}</TableCell>
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
                                      dispatch(setCurrentImage(image));
                                    }}
                                    className="cursor-pointer py-2"
                                  >
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() =>
                                      router.push(
                                        `/admin/images/${image.id}/instructions`
                                      )
                                    }
                                  >
                                    Attach Instruction
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
        open={isOpenViewDialogOpen}
        onOpenChange={
          isOpenViewDialogOpen ? setIsOpenViewDialog : setIsOpenDeleteDialog
        }
      >
        <NewImageForm />
      </Dialog>

      <Dialog
        open={isOpenDeleteDialogOpen}
        onOpenChange={
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          image={image}
          text="Do you want to delete this image"
          noText="No"
          confirmText="Yes, Delete this image"
          confirmFunc={() => deleteImage(image?.id)}
        />
      </Dialog>
    </div>
  );
};

export default Images;

const AddButton = () => {
  const dispatch = useDispatch();

  return (
    <DialogTrigger onClick={() => dispatch(setCurrentImage(null))}>
      <Button>Add Image</Button>
    </DialogTrigger>
  );
};
