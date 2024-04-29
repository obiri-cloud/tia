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
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
// import DeleteConfirmation from "../delete-confirmation";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter } from "next/navigation";
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
  const name = useSelector(
    (state: RootState) => state
  );

  console.log({name});
  

  const [imageList,setimagelist]=useState<ILabImage[]>();

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);
  

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


  const getImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/images/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setimagelist(response.data.data)
      return response.data.data;
    } catch (error) {
       console.log(error)
    }
  };

  useEffect(()=>{
    getImages()
  },[])

  console.log({name});
  

  return (
    <div className="space-y-4 m-4">
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Organization Image List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <Dialog>
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
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog  : setIsOpenViewDialog
        }
      >
        {/* <DeleteConfirmation
          image={image}
          text="Do you want to delete this image"
          noText="No"
          confirmText="Yes, Delete this image"
        //   confirmFunc={() => deleteImage(image?.id)}
        /> */}
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

// <Dialog>
// <DialogTrigger
//   onClick={() =>
//     dispatch(setCurrentImage(image))
//   }
// >
//   <Button
//     className="font-medium"
//     variant="link"
//   >
//     View
//   </Button>
// </DialogTrigger>
// <NewImageForm />
// </Dialog>
// |
// <Dialog>
// <DialogTrigger>
//   <Button
//     onClick={() => setImage(image)}
//     className="font-medium text-red-500"
//     variant="link"
//   >
//     Delete
//   </Button>
// </DialogTrigger>
// <DeleteConfirmation
//   image={image}
//   text="Do you want to delete this image"
//   noText="No"
//   confirmText="Yes, Delete this image"
//   confirmFunc={() => deleteImage(image?.id)}
// />
// </Dialog>
// |
// <Button
// onClick={() => router.push(`/admin/images/${image.id}/instructions`)}
// className="font-medium"
// variant="link"
// >
// Attach Instruction
// </Button>
