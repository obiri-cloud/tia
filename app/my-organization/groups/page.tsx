"use client";
import React, { FormEvent, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddImgGroupModal, {
  IImageChanges,
} from "@/app/components/AddImgGroupModal";

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
import AddMembersModal, {
  IMemberChanges,
} from "@/app/components/AddMembersModal";
import { Sheet } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import UpdateGroupNameModal from "@/app/components/UpdateGroupNameModal";

import apiClient from "@/lib/request";

export interface OrgGroup {
  id: string;
  name: string;
  organization: {
    name: string;
  };
}

const OrganizationGroup = () => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen4, setIsOpenViewDialog4] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<OrgGroup>();
  const [group, setGroup] = useState<OrgGroup | null>(null);
  const [emptyQuery, setemptyQuery] = useState(false);
  const [updateData, setUpdateData] = useState<any>(null);

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;

  const getGroups = async (): Promise<OrgGroup[] | undefined> => {
    try {
      const response = await apiClient.get(
        `/organization/${org_id}/group/list/`
      );

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getMembers = async (): Promise<GroupMember[] | undefined> => {
    try {
      const response = await apiClient.get(`/organization/${org_id}/members/`);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: members } = useQuery(["members"], () => getMembers());

  const getOrgImages = async (): Promise<ILabImage[] | undefined> => {
    try {
      const response = await apiClient.get(`/organization/${org_id}/images/`);

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: images } = useQuery(["orgImages"], () => getOrgImages());

  const { isLoading: loadingGroups, data: groups } = useQuery(["groups"], () =>
    getGroups()
  );

  const queryClient = useQueryClient();

  const deleteGroup = async (id: number) => {
    const response = await apiClient.delete(
      `/organization/${org_id}/group/${id}/delete/`
    );
    return response.data.data;
  };

  console.log({ groups });

  const { mutate: deleteGroupMutation } = useMutation(
    (id: number) => deleteGroup(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
        setIsOpenViewDialog(false);
        toast({
          variant: "success",
          title: "Group deleted successfully",
          duration: 2000,
        });
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

  const prepareDelete = (data: OrgGroup | undefined) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  const createGroup = async (data: string) => {
    const response = await apiClient.post(
      `/organization/${org_id}/group/create/`,
      data
    );
    return response.data;
  };

  const updateGroupName = async (data: string) => {
    const response = await apiClient.put(
      `/organization/${org_id}/group/${updateData.id}/update/`,
      data
    );
    return response.data;
  };

  const { mutate: createGroupMutation } = useMutation(
    (data: string) => createGroup(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
        (document.getElementById("group-name") as HTMLInputElement).value = "";
        toast({
          variant: "success",
          title: "Group created successfully",
          duration: 2000,
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
          title: responseData.data || responseData.detail,
          duration: 2000,
        });
        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).textContent = "Create Group";
      },
    }
  );

  const { mutate: updateGroupNameMutation } = useMutation(
    (data: string) => updateGroupName(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("groups");
        (document.getElementById("group-name") as HTMLInputElement).value = "";
        toast({
          variant: "success",
          title: "Group created successfully",
          duration: 2000,
        });
        setIsOpenViewDialog4(false);
        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).textContent = "update name";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data || responseData.detail,
          duration: 2000,
        });
        (
          document.getElementById("submit-button") as HTMLButtonElement
        ).textContent = "update name";
      },
    }
  );

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

    const data = JSON.stringify({ name });
    createGroupMutation(data);
  };

  const handleUpdateGroupName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (
      document.getElementById("create-group-submit-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("create-group-submit-button") as HTMLButtonElement
    ).textContent = "Updating group name...";
    const name = (document.getElementById("group-name") as HTMLInputElement)
      ?.value;

    updateGroupNameMutation(JSON.stringify({ name }));
  };

  const updateMember = (members: IMemberChanges) => {
    (
      document.getElementById(
        "update-member-submit-button"
      ) as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById(
        "update-member-submit-button"
      ) as HTMLButtonElement
    ).textContent = "Updating Member List...";

    if (members.added.size > 0)
      updateMemberMutation({ members: members.added, action: "add" });
    if (members.removed.size > 0)
      updateMemberMutation({ members: members.removed, action: "delete" });
  };

  const { mutate: updateMemberMutation } = useMutation(
    (data: { members: Set<string>; action: string }) =>
      updateMemberFn(data.members, data.action),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("members");
        toast({
          variant: "success",
          title: "Members updated successfully",
          description: "",
          duration: 2000,
        });
        setIsOpenViewDialog3(false);
        (
          document.getElementById(
            "update-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update member list";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.data || responseData.detail,
          duration: 2000,
        });
        (
          document.getElementById(
            "update-member-submit-button"
          ) as HTMLButtonElement
        ).textContent = "Update member list";
      },
    }
  );

  const updateMemberFn = async (members: Set<string>, action: string) => {
    try {
      const response = await apiClient.post(
        `/organization/${org_id}/group/${group?.id}/member/${action}/`,
        JSON.stringify({ user_ids: Array.from(members) })
      );
      console.log({ response });
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Members updated sucessfully`,
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Group update  error",
          description: response.data.data || response.data.detail,
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error("error", error.response.data.detail);
      const responseData = error.response.data;
      console.error("error", error.response.data.detail, responseData);
      if (error.response) {
        toast({
          variant: "destructive",
          title: responseData.data || error.response.data.detail,
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          title: responseData.data ? responseData.data : responseData.detail,
          duration: 2000,
        });
      }
    } finally {
    }
  };

  const updateImages = (images: IImageChanges) => {
    (
      document.getElementById("add-image-to-grp-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("add-image-to-grp-button") as HTMLButtonElement
    ).textContent = "Updating Image List...";

    if (images.added.size > 0)
      updateImagesMutation({ images: images.added, action: "add" });
    if (images.removed.size > 0)
      updateImagesMutation({ images: images.removed, action: "delete" });
  };

  const { mutate: updateImagesMutation } = useMutation(
    (data: { images: Set<string>; action: string }) =>
      updateImagesFn(data.images, data.action),
    {
      onSuccess: (data) => {
        console.log("data", data);
        queryClient.invalidateQueries("members");
        toast({
          variant: data.data?.message ? "success" : "destructive",
          title:
            data.data?.message ||
            (data.response.data.detail && data.response.data.detail),
          description: "",
          duration: 2000,
        });
        setIsOpenViewDialog1(false);
        (
          document.getElementById(
            "add-image-to-grp-button"
          ) as HTMLButtonElement
        ).textContent = "Update images List";
      },
      onError: (error: any) => {
        const responseData = error.response.data;
        console.log({ responseData });

        toast({
          variant: "destructive",
          title: responseData.data || responseData.detail,
          duration: 2000,
        });
        (
          document.getElementById(
            "add-image-to-grp-button"
          ) as HTMLButtonElement
        ).textContent = "Update images List";
      },
    }
  );

  const updateImagesFn = async (images: Set<string>, action: string) => {
    try {
      let response = await apiClient.post(
        `/organization/${org_id}/group/${group?.id}/image/${action}/`,
        {
          image_ids: Array.from(images),
        }
      );
      return response;
    } catch (error: any) {
      return error;
    }
  };

  const fetchSearchGroups = async (query: string) => {
    try {
      const response = await apiClient.get(
        `/organization/${org_id}/group/list/?q=${query}`
      );

      if (response.status === 200) {
        if (
          response.data.data ===
          "No Group(s) found for the specified search criteria"
        ) {
          setemptyQuery(true);
        }
        return response.data.data;
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: searchMutation } = useMutation(fetchSearchGroups, {
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        queryClient.setQueryData("groups", data);
        setemptyQuery(false);
      } else {
        queryClient.setQueryData("groups", {
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

  const debouncedfetchSearchGroups = useCallback(
    debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedfetchSearchGroups(query);
  };

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
            <CardTitle>Organizations Groups</CardTitle>

            <Button className="m-4" onClick={() => setIsOpenViewDialog2(true)}>
              Create group
            </Button>
          </CardHeader>

          <div className="flex items-center gap-4 m-5">
            <Input
              placeholder="Search Groups"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
            />
          </div>
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

                {emptyQuery && (
                  <TableCaption>
                    No Group(s) found for the specified search criteria
                  </TableCaption>
                )}
                <TableBody>
                  {!loadingGroups
                    ? Array.isArray(groups) && groups.length > 0
                      ? groups.map((group: OrgGroup, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium  underline">
                              <Link
                                className="text-blue-400"
                                href={`/my-organization/groups/${group.id}/images?name=Groups&group_name=${group.name} Lab`}
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
                                      setGroup(group),
                                        setIsOpenViewDialog3(true);
                                    }}
                                    className="font-medium cursor-pointer text-white-500 py-2"
                                  >
                                    Update Members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGroup(group),
                                        setIsOpenViewDialog1(true);
                                    }}
                                    className="font-medium cursor-pointe text-white-500 py-2"
                                  >
                                    Add Labs
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsOpenViewDialog4(true),
                                        setUpdateData(group);
                                    }}
                                    className="font-medium cursor-pointe text-white-500 py-2"
                                  >
                                    Update Group Name
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => prepareDelete(group)}
                                    className="font-medium cursor-pointer hover:text-[#ff0000_!important] text-red-500 py-2"
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
        open={isOpenViewDialogOpen4}
        onOpenChange={
          isOpenViewDialogOpen4 ? setIsOpenViewDialog4 : setIsOpenDeleteDialog
        }
      >
        <UpdateGroupNameModal
          onSubmit={handleUpdateGroupName}
          updateData={updateData}
        />
      </Dialog>

      <Sheet
        open={isOpenViewDialogOpen1}
        onOpenChange={
          isOpenViewDialogOpen1 ? setIsOpenViewDialog1 : setIsOpenDeleteDialog
        }
      >
        {group && (
          <AddImgGroupModal
            images={images}
            group={group}
            onSubmit={updateImages}
          />
        )}
      </Sheet>

      <Sheet
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenDeleteDialog
        }
      >
        {group && (
          <AddMembersModal
            members={members}
            onSubmit={updateMember}
            group={group}
          />
        )}
      </Sheet>
    </div>
  );
};

export default OrganizationGroup;
