"use client";
import React, { ChangeEvent, FC, FormEvent, SVGProps, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useQuery } from "react-query"; 
import AddImgGroupModal from '@/app/components/AddImgGroupModal'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateGroupModal from "@/app/components/CreateGroupModal"
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
import { ILabImage, IinviteData ,IOrgGroupData } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import AddMembersModal from "@/app/components/AddMembersModal";
import { log } from "console";
import useOrgCheck from "@/hooks/orgnization-check";

const Images = () => {

  const [imageList,setimagelist]=useState<IOrgGroupData[]>();
  const [status,setstatus]=useState<boolean>(false)

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] = useState<boolean>(false);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] = useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);
  const [members,setallMembers]=useState<any>([])
  const [passedData,setPassedData]=useState<IOrgGroupData>()
  const [gid,setgid]=useState<number>()

  const isOrg = useOrgCheck();
  if (isOrg) {
    return null;
  }

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  // get groups
  const getgroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  if(response.status===200){
      //     setstatus(true)
      //     return
      //  }

       console.log({response});
      setimagelist(response.data.data)
      return response;
    } catch (error) {
       console.log(error)
    }
  };

  useEffect(()=>{
    getgroups()
  },[])

  //get members
  const getmembers = async () => {
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
      setallMembers(response.data.data)
       if(response.status===200){
          setstatus(true)
          return
       }
       console.log({response});
     
      return response;
    } catch (error) {
       console.log(error)
    }
  };

  const getOrgImages = async () => {
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
      //  if(response.status===200){
      //     setstatus(true)
      //     return
      //  }
  
       console.log(response.data.data);
       setImage(response.data.data)
      return response;
    } catch (error) {
       console.log(error)
    }
  };

useEffect(()=>{
  getOrgImages()
  getmembers()
 },[])

  const deletebtn=(data:IOrgGroupData)=>{
    setPassedData(data)
    console.log(data)
    setIsOpenViewDialog(true)
  }

  //delete groups
  const deleteblink=async(data:any)=>{
    try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${data}/delete/`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              // @ts-ignore
              Authorization: `Bearer ${token}`,
            },
          }
        );
         if(response.data.status===204){
          setIsOpenViewDialog(false)
          getgroups()
            toast({
                variant:  "success",
                title: "Group Deleted Sucessfully",
                description: response.data.data,
              });

         }
  
         console.log(response.data.data);
        setimagelist(response.data.data)
        return response;
      } catch (error) {
         console.log(error)
      }
  }


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
              <CardTitle>Organizations Groups</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <div>
            {status && (
              <>
                <Button  onClick={()=>{setIsOpenViewDialog2(true)}}>Create Group</Button>
              </>
            )
            }
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
                    <TableHead className="">Group Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {imageList?.length === 0 || !status&& (
                  <TableCaption>
                    No groups available
                    <br />
                    <Button className="m-4" onClick={()=>setIsOpenViewDialog2(true)}>Create group</Button>
                  </TableCaption>
                )}
                <TableBody>
                  {imageList
                    ? imageList.length > 0
                      ? imageList.map((image, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.name}
                            </TableCell>
                            <TableCell>{image.organization.name}</TableCell>
                            {/* <TableCell>{image.created_at}</TableCell>
                            <TableCell>{image.expires}</TableCell> */}
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                <DropdownMenuItem
                                    onClick={()=>{setgid(image.id),setIsOpenViewDialog3(true)}}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Add members
                                  </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="font-medium cursor-pointer hover:text-white-500 text-white-500 py-2"
                                    onClick={()=> {router.push(`/my-organization/groups/${image.id}/members?name=group&group_name=${image.name}`)}}
                                  >
                                    View members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-medium cursor-pointer hover:text-white-500 text-white-500 py-2"
                                    onClick={()=> {router.push(`/my-organization/groups/${image.id}/images?name=Group&group_name=${image.name} Lab`)}}
                                  >
                                    View Lab
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={()=>deletebtn(image)}
                                    className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={()=>{setgid(image.id),setIsOpenViewDialog1(true)}}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Add Lab(s)
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
        
        <DeleteConfirmation
          //@ts-ignore
          text={`Do you want to delete  ${passedData?.name} group ? `}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteblink(passedData?.id)}
        />

      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen2}
        onOpenChange={
          isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
        }
      >
         <CreateGroupModal/> 
      </Dialog>


      <Dialog
        open={isOpenViewDialogOpen1}
        onOpenChange={
          isOpenViewDialogOpen1 ? setIsOpenViewDialog1 : setIsOpenDeleteDialog
        }
      >
         <AddImgGroupModal image={image} gid={gid}/>
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenDeleteDialog
        }
      >
         <AddMembersModal image={members} gid={gid}/>
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





