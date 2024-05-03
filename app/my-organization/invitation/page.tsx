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

import NewImageForm from "@/app/components/admin/new-image-form";
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
import { MoreVerticalIcon } from "lucide-react";
import InviteModal from "@/app/components/InviteModal";
import useOrgCheck from "@/hooks/orgnization-check";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Images = () => {
  const [imageList, setimagelist] = useState<IinviteData[]>();
  const [status, setstatus] = useState<boolean>(false);

  const { data: session } = useSession();

  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<IinviteData>();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const isOrg = useOrgCheck();
  if (isOrg) {
    return null;
  }

  const getInvitations = async (): Promise<IinviteData[] | undefined> => {
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
      // if (response.status === 204) {
      //   setstatus(true);
      //   return;
      // }
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isLoading: loadingInvitation,
    error: invitationError,
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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "MMMM dd, yyyy h:mm a");
  };

  const deleteInvite = async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/invitation/${id}/delete/`,
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

  const addInvite = async (formData: FormData) => {
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

  const { mutate: addInviteMutation } = useMutation(
    (formData: FormData) => addInvite(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invites");
        (document.getElementById("invite-email") as HTMLInputElement).value =
          "";
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

  const addGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //@ts-ignore
    (document.getElementById("submit-button") as HTMLButtonElement).disabled =
      true;
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Sending Invitation Link...";
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Sending Invitation Link...";
    const email = (document.getElementById("invite-email") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("email", email || "");
    addInviteMutation(formData);
  };

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
              <CardTitle>Invitation List</CardTitle>
            </div>
            <div>
              {!status && (
                <>
                  <Button
                    className="m-4"
                    onClick={() => {
                      setIsOpenViewDialog2(true);
                    }}
                  >
                    Invite members
                  </Button>
                </>
              )}
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

                {!loadingInvitation && invites && invites.length === 0 ? (
                  <TableCaption>No invites found...</TableCaption>
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
        <InviteModal onSubmit={addGroup} />
      </Dialog>
    </div>
  );
};

export default Images;
