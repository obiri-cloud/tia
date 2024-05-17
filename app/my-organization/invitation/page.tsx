"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { IinviteData } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { MoreVerticalIcon } from "lucide-react";
import InviteModal from "@/app/components/InviteModal";

import { useMutation, useQuery, useQueryClient } from "react-query";
import BulkInviteModal from "@/app/components/BulkInviteModal";

const Images = () => {
  const [imageList, setimagelist] = useState<IinviteData[]>();
  const [status, setstatus] = useState<boolean>(false);
  const [file, setfile] = useState<any>();
  const [emailInput, setEmailInput] = useState<string>();

  const { data: session } = useSession();
  const { reset } = useForm();

  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<IinviteData>();
  const [_, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [multiplEmails, setMultipleEmails] = useState<any>([]);
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  const getInvitations = async (): Promise<IinviteData[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
   
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isLoading: loadingInvitation,
    data: invites,
  } = useQuery(["invites"], () => getInvitations());

  const deletebtn = (data: IinviteData) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  const formatExpiration = (expires: string) => {
    const expirationDate = new Date(expires);
    const remainingTime = expirationDate.getTime() - new Date().getTime();
    if (remainingTime > 0) {
      return formatDistanceToNow(expirationDate, { addSuffix: true });
    } else {
      return "Expired";
    }
  };

  //mutation
  const SendInvitation = async (formData: FormData) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/create/`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    return response.data;
  };

  const addMultiple = () => {
    let emails = [];
    emails.push();
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMMM dd, yyyy h:mm a");
  };

  const deleteInvite = async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/${id}/delete/`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // @ts-ignore
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  };

  const { mutate: deleteInviteMutation } = useMutation(
    (id: number) => deleteInvite(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invites");
        setIsOpenViewDialog(false);
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data,
        });
        setIsOpenViewDialog(false);
      },
    }
  );

  const queryClient = useQueryClient();

  const addInvite = async (formData: any) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/create/`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    return response.data;
  };

  
  const BulkInvite = async (file: any) => {
    let formData = new FormData();
    formData.append("file", file);

    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/create/bulk/`,
      data:formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    return response.data;
  };

  const { mutate: addInviteMutation } = useMutation(
    (formData: any) => addInvite(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invites");
        setEmailInput("");
        setMultipleEmails([]);
        toast({
          variant: "success",
          title: `Invitation Sent sucessfully`,
        });
        setIsOpenViewDialog2(false);
        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).textContent = "Send Invitation Link";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data,
        });
        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).textContent = "Send Invitation Link";

        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).disabled = false;
      },
    }
  );

  const { mutate: addBulkInviteMutation } = useMutation(
    (file: any) => BulkInvite(file),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("invites");
        setfile(null);
        toast({
          variant:data.status===200?"success":"destructive",
          title: `${data.data}`,
        });
        setIsOpenViewDialog3(false);
        (
          document.getElementById("submit-btn") as HTMLButtonElement
        ).textContent = "Send Invitation Link";
      },
      onError: (error: any) => {
        const responseData = error.response.data;

        toast({
          variant: "destructive",
          title: responseData.data,
        });
        (
          document.getElementById("submit-btn") as HTMLButtonElement
        ).textContent = "Send Invitation Link";

        (
          document.getElementById("submit-btn") as HTMLButtonElement
        ).disabled = false;
      },
    }
  );

  const BulkEmails = () => {
    (document.getElementById("submit-btn") as HTMLButtonElement).disabled =
      true;
    (document.getElementById("submit-btn") as HTMLButtonElement).textContent =
      "Sending Invitation Link...";
    (document.getElementById("submit-btn") as HTMLButtonElement).textContent =
      "Sending Invitation Link...";

      addBulkInviteMutation(file);
  };


  const sendEmails = () => {
    (document.getElementById("submit-btn") as HTMLButtonElement).disabled =
      true;
    (document.getElementById("submit-btn") as HTMLButtonElement).textContent =
      "Sending Invitation Link...";
    (document.getElementById("submit-btn") as HTMLButtonElement).textContent =
      "Sending Invitation Link...";

    const emailData = {
      emails: Array.from(new Set(multiplEmails.map((item: any) => item.email.trim()))),
    };


    addInviteMutation(emailData);
  };


  const addGroup = () => {

    if (emailInput) {
      setMultipleEmails((prevEmails: any) => [
        ...prevEmails,
        { email: emailInput },
      ]);

      setEmailInput("");
      reset({ email: "" });
    }
  };

  console.log({ multiplEmails });

  const removeEmail = (emailToRemove: string) => {
    setMultipleEmails((currentEmails: string[]) =>
      currentEmails.filter((email: string) => email !== emailToRemove)
    );
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organzation</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        {session?.user && session?.user.data.is_admin ? (
          <Link href="/dashboard" className="font-medium text-mint">
            Go to dashboard
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Invitation List</CardTitle>
            </div>
            <div    className="flex space-x-4">
            <Button
             
                onClick={() => {
                  setIsOpenViewDialog3(true);
                }}
              >
                Bulk invite
              </Button>

              <Button
                className=""
                onClick={() => {
                  setIsOpenViewDialog2(true);
                }}
              >
                Invite members
              </Button>
            </div>
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

                {!loadingInvitation &&
                ((invites && invites.length === 0) || !invites) ? (
                  <TableCaption>No pending invites found...</TableCaption>
                ) : null}
                {loadingInvitation ? (
                  <TableCaption>
                    Loading invitations in your organization...
                  </TableCaption>
                ) : null}

                <TableBody>
                  {!loadingInvitation
                    ? invites && invites.length > 0
                      ? invites.map((invite: IinviteData, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {invite.recipient_email}
                            </TableCell>
                            <TableCell>{invite.invitation_status}</TableCell>
                            <TableCell>
                              {formatDate(invite.created_at)}
                            </TableCell>
                            <TableCell>
                              {invite.expires
                                ? formatExpiration(invite.expires)
                                : "Expires soon"}
                            </TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={() => deletebtn(invite)}
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
        <DeleteConfirmation
          text={`Do you want to delete ${passedData?.recipient_email} invitation`}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteInviteMutation(passedData?.id ?? 0)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen2}
        onOpenChange={
          isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
        }
      >
        <InviteModal
          onSubmit={addGroup}
          bulkEmails={multiplEmails}
          onRemoveEmail={removeEmail}
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          onSend={sendEmails}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenDeleteDialog
        }
      >
        <BulkInviteModal setfile={setfile} onSend={BulkEmails} />

      </Dialog>
    </div>
  );
};

export default Images;
