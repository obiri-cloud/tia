"use client";
import React, { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

import { getImageListX } from "@/app/components/admin/overview";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter } from "next/navigation";
import { GroupMember } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import AttachMemberToGroup from "@/app/components/AttachMemberToGroup";
import { OrgGroup } from "../groups/page";

const Images = () => {
  const { data: session } = useSession();

  const [image, setImage] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);

  const [gid, setGid] = useState<number>();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const getMembers = async (): Promise<GroupMember[] | undefined> => {
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

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: members, isLoading: loadingMembers } = useQuery(
    ["members"],
    () => getMembers()
  );

  const getGroups = async (): Promise<OrgGroup[] | undefined> => {
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

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isLoading: loadingGroups,
    error: errorGroups,
    data: groups,
  } = useQuery(["groups"], () => getGroups());

  const queryClient = useQueryClient();

  const attachMemberToGroup = (
    event: FormEvent<HTMLFormElement>,
    groups: Set<string>
  ) => {
    event.preventDefault();
    console.log("groups", groups);
    
    (
      document.getElementById("add-member-submit-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("add-member-submit-button") as HTMLButtonElement
    ).textContent = "Updating Member List...";

    // attachMemberToGroupMutation(groups);
  };

  const { mutate: attachMemberToGroupMutation } = useMutation(
    (members: Set<string>) => attachMemberToGroupFn(members),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("members");
        (document.getElementById("group-name") as HTMLInputElement).value = "";
        toast({
          variant: "success",
          title: "Members updated successfully",
          description: "",
        });
        // setIsOpenViewDialog3(false);
        (
          document.getElementById(
            "add-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data,
        });
        (
          document.getElementById(
            "add-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
    }
  );

  const attachMemberToGroupFn = async (members: Set<string>) => {
    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${gid}/member/add/`,
      data: {
        user_ids: Array.from(members),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios(axiosConfig);
      console.log({ response });
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Members updated sucessfully`,
          description: ``,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Group update  error",
          description: response.data,
        });
      }
    } catch (error: any) {
      console.error("error", error);
      const responseData = error.response.data;
      if (error.response) {
        toast({
          variant: "destructive",
          title: responseData.data,
        });
      } else {
        toast({
          variant: "destructive",
          title: responseData.data,
        });
      }
    } finally {
    }
  };

  const addMember = (
    event: FormEvent<HTMLFormElement>,
    members: Set<string>
  ) => {
    event.preventDefault();
    (
      document.getElementById("add-member-submit-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("add-member-submit-button") as HTMLButtonElement
    ).textContent = "Updating Member List...";

    addMemberMutation(members);
  };

  const { mutate: addMemberMutation } = useMutation(
    (members: Set<string>) => addMemberFn(members),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("members");
        (document.getElementById("group-name") as HTMLInputElement).value = "";
        toast({
          variant: "success",
          title: "Members updated successfully",
          description: "",
        });
        // setIsOpenViewDialog3(false);
        (
          document.getElementById(
            "add-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data,
        });
        (
          document.getElementById(
            "add-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
    }
  );

  const addMemberFn = async (members: Set<string>) => {
    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${gid}/member/add/`,
      data: {
        user_ids: Array.from(members),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios(axiosConfig);
      console.log({ response });
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Members updated sucessfully`,
          description: ``,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Group update  error",
          description: response.data,
        });
      }
    } catch (error: any) {
      console.error("error", error);
      const responseData = error.response.data;
      if (error.response) {
        toast({
          variant: "destructive",
          title: responseData.data,
        });
      } else {
        toast({
          variant: "destructive",
          title: responseData.data,
        });
      }
    } finally {
    }
  };

  // const deletelink = async (data: any) => {
  //   try {
  //     const response = await axios.delete(
  //       `${process.env.NEXT_PUBLIC_BE_URL}/organization/member/${data}/delete/`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           // @ts-ignore
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.data.status === 204) {
  //       toast({
  //         variant: "success",
  //         title: "Invitation Deleted Sucessfully",
  //         description: response.data.data,
  //       });
  //       setIsOpenViewDialog(false);
  //       getImages();
  //     }

  //     console.log({ response });
  //     setimagelist(response.data.data);
  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  console.log("members", members);


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
              <CardTitle>Organization Members</CardTitle>
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
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                {loadingMembers ? (
                  <TableCaption>
                    Loading members in your organization...
                  </TableCaption>
                ) : null}

                {!loadingMembers && members?.length === 0 ? (
                  <TableCaption>
                    No members in your organization...
                  </TableCaption>
                ) : null}
                <TableBody>
                  {!loadingMembers
                    ? members && members.length > 0
                      ? members.map((member: GroupMember) => (
                          <TableRow key={member.member.id}>
                            <TableCell className="font-medium">
                              {member.member.email}
                            </TableCell>
                            <TableCell>{member.member.first_name}</TableCell>
                            <TableCell>{member.invitation_status}</TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGid(+member.member.id);
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
        open={isOpenViewDialogOpen}
        onOpenChange={
          isOpenViewDialogOpen ? setIsOpenViewDialog : setIsOpenDeleteDialog
        }
      >
        <AttachMemberToGroup
          groups={groups}
          onSubmit={() => attachMemberToGroup}
        />
      </Dialog>

      {/* 
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
      </Dialog> */}
    </div>
  );
};

export default Images;
