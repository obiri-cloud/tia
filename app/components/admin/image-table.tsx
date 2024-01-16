"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { FC, useEffect, useRef, useState } from "react";
import NewImageForm from "./new-image-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageListX } from "./overview";
import { setCurrentImage, setImageCount, setImageList } from "@/redux/reducers/adminSlice";
import { useDispatch } from "react-redux";

interface IImageTableTable {
  imageList: ILabImage[] | null;
}
const ImageTable: FC<IImageTableTable> = ({ imageList }) => {
  console.log("imageList",imageList);
  
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const [localImageList, setLocalImageList] = useState(imageList);
  const [disabled, setDisabled] = useState(false);

  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  useEffect(() => {
    console.log("imageList", imageList);

    setLocalImageList(imageList);
  }, [imageList]);

  const deleteImage = async (id: number) => {
    setDisabled(true);

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
      setDisabled(false);
    }
  };

  return (
    <Dialog>
      <div className="space-y-8">
        {localImageList ? (
          localImageList.length > 0 ? (
            localImageList.map((lab, i) => (
              <div key={i} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback className="uppercase">
                    {lab.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <DialogTrigger
                  className="w-full text-left"
                  onClick={() => {
                    dispatch(setCurrentImage(lab));
                  }}
                >
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {lab.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lab.difficulty_level}
                    </p>
                  </div>
                </DialogTrigger>
                <div className="ml-auto font-medium">
                  <Button
                    disabled={disabled}
                    className="disabled:bg-red-900/90"
                    onClick={() => deleteImage(lab.id)}
                    ref={buttonRef}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4">No images found...</p>
          )
        ) : (
          <>
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-3 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="ml-auto font-medium">
                  <Skeleton className="h-9 w-[80px]" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <NewImageForm
      />
    </Dialog>
  );
};

export default ImageTable;
