"use client";
import React, { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddImgGroupModal from "@/app/components/AddImgGroupModal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateGroupModal from "@/app/components/CreateGroupModal";
import { toast } from "@/components/ui/use-toast";

import axios from "axios";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter } from "next/navigation";
import { ILabImage, GroupMember } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import AddMembersModal, { IMemberChanges } from "@/app/components/AddMembersModal";
import OrgDialog from "@/app/components/my-organization/org-dialog";
import { z } from "zod";
import useOrgCheck from "@/hooks/orgnization-check";

export interface OrgGroup {
  id: string;
  name: string;
  organization: {
    name: string;
  };
}

const OrganizationGroup = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage[]>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<OrgGroup>();
  const [gid, setGid] = useState<number>();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

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

  const {
    data: members,
  } = useQuery(["members"], () => getMembers());


  const {
    isLoading: loadingGroups,
    error: errorGroups,
    data: groups,
  } = useQuery(["groups"], () => getGroups());

  
  const queryClient = useQueryClient();

  const deleteGroup = async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${id}/delete/`,

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

  const { mutate: deleteGroupMutation } = useMutation(
    (id: number) => deleteGroup(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
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

  const prepareDelete = (data: OrgGroup | undefined) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  const createGroup = async (formData: FormData) => {
    console.log({ formData });
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/create/`,
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
    mutate: createGroupMutation,
    isLoading: updatingGroups,
    error: groupUpdateError,
  } = useMutation((formData: FormData) => createGroup(formData), {
    onSuccess: () => {
      queryClient.invalidateQueries("groups");
      (document.getElementById("group-name") as HTMLInputElement).value = "";
      toast({
        variant: "success",
        title: "Group created successfully",
        description: "",
      });
      setIsOpenViewDialog2(false);
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Create Group";
    },
    onError: (error: any) => {
      const responseData = error.response.data;
      toast({
        variant: "destructive",
        title: responseData.data,
      });
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Create Group";
    },
  });

  const createNewGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (
      document.getElementById("create-group-submit-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("create-group-submit-button") as HTMLButtonElement
    ).textContent = "Creating Group...";
    const name = (document.getElementById("group-name") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("name", name || "");
    createGroupMutation(formData);
  };

  const updateMember = (
    event: FormEvent<HTMLFormElement>,
    members: IMemberChanges
  ) => {
    event.preventDefault();
    console.log("members", members);
    
    (
      document.getElementById("update-member-submit-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("update-member-submit-button") as HTMLButtonElement
    ).textContent = "Updating Member List...";

    updateMemberMutation({members:members.added, action:"add"});
    updateMemberMutation({members:members.removed, action:"delete"});

  };

  const { mutate: updateMemberMutation } = useMutation(
    (data:{members: Set<string>, action: string}) => updateMemberFn(data.members, data.action),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("members");
        toast({
          variant: "success",
          title: "Members updated successfully",
          description: "",
          duration: 2000
        });
        setIsOpenViewDialog3(false);
        (
          document.getElementById(
            "update-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data,
          duration: 2000

        });
        (
          document.getElementById(
            "update-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update Member List";
      },
    }
  );

  const updateMemberFn = async (members: Set<string>, action: string) => {
    console.log("action", action);
    console.log("members", members);
    
    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${gid}/member/${action}/`,
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
          duration: 2000

        });
      } else {
        toast({
          variant: "destructive",
          title: "Group update  error",
          description: response.data,
          duration: 2000

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
            <CardTitle>Organizations Groups</CardTitle>

            <Button className="m-4" onClick={() => setIsOpenViewDialog2(true)}>
              Create group
            </Button>
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

                {!loadingGroups && groups && groups.length === 0 ? (
                  <TableCaption>No groups in your organization...</TableCaption>
                ) : null}

                {loadingGroups ? (
                  <TableCaption>
                    Loading groups in your organization...
                  </TableCaption>
                ) : null}
                <TableBody>
                  {!loadingGroups
                    ? groups && groups.length > 0
                      ? groups.map((group: OrgGroup, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium  underline">
                              <Link
                              className="text-blue-400"
                                href={`/my-organization/groups/${group.id}/images?name=Group&group_name=${group.name} Lab`}
                              >
                                {group.name}
                              </Link>
                            </TableCell>
                            <TableCell>{group.organization.name}</TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGid(Number(group.id)),
                                        setIsOpenViewDialog3(true);
                                    }}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Update Members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => prepareDelete(group)}
                                    className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGid(Number(group.id)),
                                        setIsOpenViewDialog1(true);
                                    }}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Add Labs
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
          text={`Do you want to delete  ${passedData?.name} group ? `}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteGroupMutation(Number(passedData?.id) ?? 0)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen2}
        onOpenChange={
          isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
        }
      >
        <CreateGroupModal onSubmit={createNewGroup} />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen1}
        onOpenChange={
          isOpenViewDialogOpen1 ? setIsOpenViewDialog1 : setIsOpenDeleteDialog
        }
      >
        <AddImgGroupModal
          image={image}
          gid={gid}
          onSubmit={() => setIsOpenViewDialog1(false)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenDeleteDialog
        }
      >
        <AddMembersModal members={members} onSubmit={updateMember} gId={gid} />
      </Dialog>
    </div>
  );
};

export default OrganizationGroup;
