"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { IinviteData } from "@/app/types";
import Link from "next/link";
import { ChevronRight, MoreVerticalIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import InviteModal from "@/app/components/InviteModal";

import { useMutation, useQuery, useQueryClient } from "react-query";
import BulkInviteModal from "@/app/components/BulkInviteModal";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "@/app/components/columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setTableData } from "@/redux/reducers/tableSlice";
import { setdialogState } from "@/redux/reducers/dialogSlice";
import { setnextState } from "@/redux/reducers/nextPaginationSlice";
import { TableBody, TableHeader, TableRow,

  TableHead,
  TableCaption,
  TableCell,
  Table

 } from "@/components/ui/table";
import { DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem

} from "@/components/ui/dropdown-menu";
import {  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationNext, 
  PaginationLink} from "@/components/ui/pagination";


const Images = () => {
  const [file, setfile] = useState<any>();
  const [emailInput, setEmailInput] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");

  const [emptyQuery, setemptyQuery] = useState(false);

  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<IinviteData>();
  const [_, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [multiplEmails, setMultipleEmails] = useState<any>([]);

  const [pages, setPages] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { data: session } = useSession();
  const { reset } = useForm();

  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  const [loadingInvitation,setloadingInvitation]=useState<boolean>(false) 
  const { data:dataDiag } = useSelector((state: RootState) => state.dialogBtn);
  const { data:tableData } = useSelector((state: RootState) => state.table);
  // const { data } = useSelector((state: RootState) => state.dialogBtn);
  const { data } = useSelector((state: RootState) => state.table);
  const dispatch = useDispatch()

  

  const getInvitations = async (): Promise<IinviteData[] | undefined> => {
    try {
      setloadingInvitation(true)
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
      console.log('--here-->',response.data.next);

      if(response.data.next){
        dispatch(setnextState(true))
        }

      dispatch(setTableData(response.data.data))
      setloadingInvitation(false)

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };


  const deletebtn = (data: IinviteData) => {
    setPassedData(data);
    dispatch(setdialogState(true))
  };

  useEffect(()=>{
   getInvitations()
  },[])

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
    getInvitations()
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
          title: responseData.data || responseData.detail,
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
      data: formData,
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
        getInvitations()
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
          title: responseData.data || responseData.detail,
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
        getInvitations()
        console.log({ i_think_is_an_error: data });

        toast({
          variant: data.status === 200 ? "success" : "destructive",
          title: `${data.data}`,
        });
        setIsOpenViewDialog3(false);
        (
          document.getElementById("submit-btn") as HTMLButtonElement
        ).textContent = "Send Invitation Link";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        console.log({ responseData });

        toast({
          variant: "destructive",
          title: responseData.detail,
        });
        (
          document.getElementById("submit-btn") as HTMLButtonElement
        ).textContent = "Send Invitation Link";

        (document.getElementById("submit-btn") as HTMLButtonElement).disabled =
          false;
      },
    }
  );

  console.log(totalPages);

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
      emails: Array.from(
        new Set(multiplEmails.map((item: any) => item.email.trim()))
      ),
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

  const fetchsearchInvites = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/list/?q=${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (
          response.data.data ===
          "No Invitation(s) found for the specified search criteria"
        )
          setemptyQuery(true);
        return response.data.data;
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.log({ error });

      if (axios.isAxiosError(error) && error.response) {
        return {
          status: error.response.status,
          message: error.response.data,
        };
      } else {
        console.error(error);
      }
    }
  };

  const { mutate: searchMutation } = useMutation(fetchsearchInvites, {
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        queryClient.setQueryData("invites", data);
        dispatch(setTableData(data))
        setemptyQuery(false);
      } else {
        queryClient.setQueryData("invites", {
          status: data.status,
          message: data.message,
        });
      }
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const debouncedfetchsearchInvites = useCallback(
    debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedfetchsearchInvites(query);
  };

  const handlePreviousPage = () => {
    if (pages > 1) {
      setPages((prev) => prev - 1);
      getInvitations();
    }
  };

  const handleNextPage = () => {
    setPages((prev) => prev + 1);
    getInvitations();
  };

  console.log(pages);

  const { mutate: updatePage } = useMutation(getInvitations, {
    onSuccess: () => {

      queryClient.invalidateQueries("invites");

      toast({
        variant: "success",
        title: "Member Role Updated Successfully",
      });

    },
    onError: (error: AxiosError) => {
      console.log({ error });

      toast({
        variant: "destructive",
        //@ts-ignore
        title: error?.response.data.detail,
      });
    },
  });

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <Link
            href={
              session?.user.data.role
                ? `/dashboard/organizations`
                : "my-organization"
            }
            className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
          >
            Organizations
          </Link>
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
            <div className="flex space-x-4">
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
          <div className="flex items-center gap-4 m-5">
            <Input
              placeholder="Search for users"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
            />
          </div>
          <Dialog>
            {/* <CardContent className="pl-2">
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
                {emptyQuery && (
                  <TableCaption>
                    No Invitation(s) found for the specified search criteria
                  </TableCaption>
                )}

                <TableBody>
                  {!loadingInvitation &&
                  Array.isArray(invites) &&
                  invites.length > 0
                    ? invites.map((invite: any, i: any) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {invite?.recipient_email}
                          </TableCell>
                          <TableCell>{invite?.invitation_status}</TableCell>
                          <TableCell>
                            {formatDate(invite?.created_at)}
                          </TableCell>
                          <TableCell>
                            {invite.expires
                              ? formatExpiration(invite?.expires)
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
                    : null}
                </TableBody>
              </Table>
              <PaginationContent>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={handlePreviousPage} />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#">{pages}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext href="#" onClick={handleNextPage} />
                  </PaginationItem>
                </PaginationContent>
              </PaginationContent>
            </CardContent> */}

            {tableData && (
              <DataTable
                data={
                     tableData as IinviteData[]
                }
                columns={columns}
              />
            )}

           <CardContent className="pl-2">
              <Table>
                {!loadingInvitation &&
                ((tableData && tableData.length === 0) || !tableData) ? (
                  <TableCaption>No pending invites found...</TableCaption>
                ) : null}
                {loadingInvitation ? (
                  <TableCaption>
                    Loading invitations in your organization...
                  </TableCaption>
                ) : null}
                {emptyQuery && (
                  <TableCaption>
                    No Invitation(s) found for the specified search criteria
                  </TableCaption>
                )}
              </Table>
            </CardContent>
          </Dialog>
        </Card>
      </div>

      <Dialog
        open={dataDiag}
        onOpenChange={
          dataDiag ? setdialogState : setIsOpenDeleteDialog
        }
      >
        <DeleteConfirmation
          text={`Do you want to delete ${passedData?.recipient_email} invitation`}// ${passedData?.recipient_email}
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
