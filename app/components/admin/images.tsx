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
import NewImageForm from "./new-image-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "@/components/ui/use-toast";
import { getImageListX } from "./overview";
import axios from "axios";
import { useSession } from "next-auth/react";
import { setCurrentImage, setImageCount, setImageList } from "@/redux/reducers/adminSlice";

const Images = () => {
  const { imageCount, imageList } = useSelector(
    (state: RootState) => state.admin
  );

  const { data: session } = useSession();
  const dispatch = useDispatch();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const deleteImage = async (id: number) => {
    // setDisabled(true);

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
        // setLocalImageList((prev) => prev?.filter((image) => image.id !== id));
        getImageListX(token).then((response) => {
          dispatch(setImageCount(response.data.count));
          dispatch(setImageList(response.data.results));
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
  return (
    <div className="space-y-4">
      <Dialog>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Images
              </CardTitle>
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
              

              <DialogTrigger onClick={() => dispatch(setCurrentImage(null))}>
                <Button>Add Image</Button>
              </DialogTrigger>
            </CardHeader>
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
                              <DialogTrigger
                                onClick={() => dispatch(setCurrentImage(image))}
                              >
                                <Button className="font-medium" variant="link">
                                  View
                                </Button>
                              </DialogTrigger>
                              |
                              <Button
                                onClick={() => deleteImage(image.id)}
                                className="font-medium text-red-500"
                                variant="link"
                              >
                                Delete
                              </Button>
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
        <NewImageForm  />
      </Dialog>
    </div>
  );
};

export default Images;
