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
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query"; 
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
import { formatDistanceToNow,format } from 'date-fns';
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
import { ILabImage, IinviteData  } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import InviteModal from "@/app/components/InviteModal"
import useOrgCheck from "@/hooks/orgnization-check";
import { Monda } from "next/font/google";
import { boolean } from "zod";
const invitationPage = () => {

  const [imageList,setimagelist]=useState< IinviteData[]>();
  const [status,setstatus]=useState<boolean>(false)

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);
  const [passedData,setPassedData]=useState<IinviteData>()
  const queryClient = useQueryClient();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const isOrg = useOrgCheck();
  if (isOrg) {
    return null;
  }

  const getInvites = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/invitation/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
       if(response.data.status===404){
          setstatus(true)
          return
       }

       console.log({response});
      setimagelist(response.data.data)
      return response.data.data
    } catch (error) {
       console.log(error)
    }
  };


  const {
    isLoading: loadingInvites,
    error: errorOnInvites,
    data: invites,
  } = useQuery(["invites"], () => getInvites());


  const deletebtn=(data:IinviteData)=>{
    setPassedData(data)
    setIsOpenViewDialog(true)
  }

  const formatExpiration = (expires: string) => {
    const expirationDate = new Date(expires);
    const remainingTime = expirationDate.getTime() - new Date().getTime();
    if (remainingTime > 0) {
      return formatDistanceToNow(expirationDate, { addSuffix: true });
    } else {
      return 'Expired';
    }
  };

 //mutation
 const SendInvitation = async (formData: FormData) => {
  const axiosConfig = {
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/invitation/create/`,
    data: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios(axiosConfig);
  return response.data;
};

const {
  mutate: SendInviteMutation,
  isLoading: updatingGroups,
  error: groupUpdateError,
} = useMutation((formData: FormData) => SendInvitation(formData), {
  onSuccess: () => {
    queryClient.invalidateQueries("invites");
    (document.getElementById("email-id") as HTMLInputElement).value = "";
    toast({
      variant: "success",
      title: "Invitation Sent Successfully",
      description: "",
    });
    setIsOpenViewDialog2(false);
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Invitation Sent";
  },


  onError: (error: any) => {
    const responseData = error.response.data;
    toast({
      variant: "destructive",
      title: responseData.data,
    });
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Error Sending Invitaion";
  },
});

const SendInvite = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  //@ts-ignore
  (document.getElementById("submit-button") as HTMLButtonElement).disabled =
    true;
  (
    document.getElementById("submit-button") as HTMLButtonElement
  ).textContent = "sending";
  (
    document.getElementById("submit-button") as HTMLButtonElement
  ).textContent = "Sending Invitation...";
  const email = (document.getElementById("email-id") as HTMLInputElement)
    ?.value;

  const formData = new FormData();
  formData.append("email", email || "");
  SendInviteMutation(formData);
};

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'MMMM dd, yyyy h:mm a');
  };


  // const deleteblink=async(data:any)=>{
  //   try {
  //       const response = await axios.delete(
  //         `${process.env.NEXT_PUBLIC_BE_URL}/organization/invitation/${data}/delete/`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //             // @ts-ignore
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //        if(response.data.status===204){
  //           toast({
  //               variant:  "success",
  //               title: "Invitation Deleted Sucessfully",
  //               description: response.data.data,
  //             });
  //             setIsOpenViewDialog(false)
  //             // getInvites()
  //        }
  
  //       console.log(response.data.data)
  //       return response;
  //     } catch (error) {
  //        console.log(error)
  //     }
  // }

  //


  const deleteInviteMutation = useMutation(
    (data: any) =>
      axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/invitation/${data}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invites");
        toast({
          variant: "success",
          title: "Invitation Deleted Successfully",
          description: "",
        });
        setIsOpenViewDialog(false);
      },
      onError: (error) => {
        console.error("Error deleting invitation:", error);
      },
    }
  );

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
              <CardTitle>Invitation List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <div>
              <>
                <Button className="m-4"  onClick={()=>{setIsOpenViewDialog2(true)}}>Invite Members</Button>
              </>
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
                    <TableHead className="">Recipient Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {!invites && (
                  <TableCaption>
                     You have no pending invitations
                    <br />
                  </TableCaption>
                )}
                <TableBody>
                  {invites
                    ? invites.length > 0
                      ? invites.map((image:IinviteData, i:number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.recipient_email}
                            </TableCell>
                            <TableCell>{image.invitation_status.toUpperCase()}</TableCell>
                            <TableCell>{formatDate(image.created_at)}</TableCell>
                            <TableCell>{image.expires ? formatExpiration(image.expires) : 'Expires soon'}</TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={()=>deletebtn(image)}
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
        {/* <InviteModal/> */}
        <DeleteConfirmation
          //@ts-ignore
          text={`Do you want to delete ${passedData?.recipient_email} invitation`}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() =>deleteInviteMutation.mutate(passedData?.id)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen2}
        onOpenChange={
          isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
        }
      >
        <InviteModal  onSubmit={SendInvite} />
      </Dialog>



    </div>
  );
};

export default invitationPage;