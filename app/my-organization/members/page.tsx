"use client";
import React, { FormEvent, useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
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
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { GroupMember } from "@/app/types";
import Link from "next/link";
import { ChevronDownIcon, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

const Images = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<any>();
  const [role, setrole] = useState<string>("");
  const [position, setPosition] = React.useState("bottom");
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [results, setresults] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const token = session?.user!.tokens?.access_token ?? "";
  const org_id = session?.user!.data?.organization_id;

  const getMembers = async (): Promise<GroupMember[] | undefined | string> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/members/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ members: response.data.data });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: members, isLoading: loadingMembers } = useQuery(
    ["members"],
    () => getMembers()
  );

  const debounce = (func: (e: string) => void, delay: number) => {
    let timeoutId: any;
    return (...args: any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const deleteMember = async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/member/${id}/delete/`,
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

  const { mutate: deleteMemberMutation } = useMutation(
    (id: number) => deleteMember(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("members");
        setIsOpenDeleteDialog(false);
        toast({
          variant: "success",
          title: "Member deleted Sucessfully",
        });
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

  const updateRole = async ({ id, role }: { id: string; role: string }) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/member/${id}/update/role/`,
      { role: role },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const { mutate: updateRoleMutation } = useMutation(updateRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("members");
      toast({
        variant: "success",
        title: "Member Role Updated Successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update role",
      });
    },
  });

  const ROLES = [
    {
      roles: "Admin",
      desc: "Admin has full control over Labs, Groups, Members, and Invitations but cannot manage Organization settings.",
    },
    {
      roles: "Editor",
      desc: "Editor can modify Labs, Groups, Members, and Invitations, except for billing and organizational settings.",
    },
    {
      roles: "Viewer",
      desc: "Viewer has access only to view content, including Labs, Groups, Members, and Invitations.",
    },
    {
      roles: "Member",
      desc: "Member has basic access without permissions to view or manage Organization content.",
    },
  ];

  const fetchMembers = async (query: string) => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BE_URL
        }/organization/${org_id}/members/?q=${query}${
          role == "" ? "" : `&role=${role}`
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: searchMutation } = useMutation(fetchMembers, {
    onSuccess: (data) => {
      console.log({ data: data });
      queryClient.setQueryData("members", data);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const debouncedFetchMembers = useCallback(
    debounce((query: string) => searchMutation(query), 400),
    [searchMutation]
  );

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedFetchMembers(query);
  };

  //fetch_role
  const fetchRole = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/members/?role=${query}&role=${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: searcRoleMutation } = useMutation(fetchRole, {
    onSuccess: (data) => {
      console.log({ data: data });
      queryClient.setQueryData("members", data);
      setSearchQuery("");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const debouncedRoleMembers = useCallback(
    debounce((query: string) => searcRoleMutation(query), 100),
    [searcRoleMutation]
  );

  const fetchrole = (query: string) => {
    console.log({ query });
    if (query == "all") {
      queryClient.invalidateQueries("members");
      return;
    }
    debouncedRoleMembers(query);
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organization</span>
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

          <div className="flex items-center gap-4 m-5">
            <Input
              placeholder="Search members"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
            />
            <Select onValueChange={(newRole) => fetchrole(newRole)}>
              <SelectTrigger className="w-[180px] bg-inherit">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>

              <SelectContent className="overflow-visible">
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  {ROLES.map((role) => (
                    <>
                      <SelectItem value={role.roles}>{role.roles}</SelectItem>
                    </>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                {loadingMembers ? (
                  <TableCaption>
                    Loading members in your organization...
                  </TableCaption>
                ) : null}
                {!loadingMembers &&
                ((members && members.length === 0) ||
                  members === "No members in the organization" ||
                  members ===
                    "No members found for the specified search criteria") ? (
                  <TableCaption>
                    {" "}
                    No members in your organization...
                  </TableCaption>
                ) : null}
                <TableBody>
                  {!loadingMembers &&
                  Array.isArray(members) &&
                  members.length > 0
                    ? members.map((member: GroupMember) => (
                        <TableRow key={member.member.id}>
                          <TableCell className="font-medium">
                            {member.member.email}
                          </TableCell>
                          <TableCell>
                            {member.member.first_name} {member.member.last_name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {member.invitation_status}
                          </TableCell>
                          <TooltipProvider>
                            <TableCell>
                              <Select
                                value={member.role}
                                onValueChange={(newRole) =>
                                  updateRoleMutation({
                                    id: member.member.id,
                                    role: newRole,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[180px] bg-inherit">
                                  <SelectValue
                                    placeholder={`${member?.role}`}
                                  />
                                </SelectTrigger>
                                <SelectContent className="overflow-visible">
                                  <SelectGroup>
                                    <SelectLabel>Assign Role</SelectLabel>
                                    {ROLES.map((role: any) => (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <SelectItem value={role.roles}>
                                            {role.roles}
                                          </SelectItem>
                                        </TooltipTrigger>
                                        <TooltipContent className="absolute left-10 z-50 w-[200px] bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300">
                                          <p>{role.desc}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TooltipProvider>

                          <TableCell className="underline font-medium text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVerticalIcon className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="left-[-20px_!important]">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setIsOpenDeleteDialog(true);
                                    setImage(member);
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
                    : null}
                </TableBody>
              </Table>
            </CardContent>
          </Dialog>
        </Card>
      </div>
      <Dialog
        open={isOpenDeleteDialogOpen}
        onOpenChange={
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          // image={image}
          text={`Do you want to delete ${image?.member.first_name} from your organization`}
          noText="No"
          confirmText="Yes, Delete "
          confirmFunc={() => deleteMemberMutation(image?.member.id)}
        />
      </Dialog>
    </div>
  );
};

export default Images;
