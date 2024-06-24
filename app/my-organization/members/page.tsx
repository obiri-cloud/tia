"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Table, TableCaption } from "@/components/ui/table";
import { MemberColumns } from "@/app/components/MemberColumns";
import { toast } from "@/components/ui/use-toast";
import apiClient from "@/lib/request";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { GroupMember } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MemberDataTable } from "@/app/components/MemberDataTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setMemberOriginalPageSize,
  setMemberPageSize,
  setMemberTableData,
} from "@/redux/reducers/MemberTableSlice";
import { setnextState } from "@/redux/reducers/nextPaginationSlice";

const ROLES = [
  {
    role: "Admin",
    desc: "Admin has full control over Labs, Groups, Members, and Invitations but cannot manage Organization settings.",
  },
  {
    role: "Editor",
    desc: "Editor can modify Labs, Groups, Members, and Invitations, except for billing and organizational settings.",
  },
  {
    role: "Viewer",
    desc: "Viewer has access only to view content, including Labs, Groups, Members, and Invitations.",
  },
  {
    role: "Member",
    desc: "Member has basic access without permissions to view or manage Organization content.",
  },
];

const Images = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<any>();
  const [role, setRole] = useState<string>("");
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [loadingMembers, setIsLoadingMembers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null | boolean>(null);
  const dispatch = useDispatch();
  const { Memberdata: tableData } = useSelector(
    (state: RootState) => state.memberTable
  );
  const token = session?.user!.tokens?.access_token ?? "";
  const org_id = session?.user!.data?.organization_id;

  const getMembers = async (): Promise<GroupMember[] | undefined> => {
    try {
      setIsLoadingMembers(true);
      setError(null);
      const response = await apiClient.get(`/organization/${org_id}/members`);

      if (response.data.status === 404) {
        setIsLoadingMembers(false);
        setError("No members found for this organization.");
        return;
      }

      dispatch(setMemberTableData(response.data.data));
      dispatch(setMemberPageSize(Math.ceil(response.data.count / 2)));
      dispatch(setMemberOriginalPageSize(response.data.count));
      setIsLoadingMembers(false);
      setError(null);
      return response.data.data;
    } catch (error) {
      setError("Failed to load members. Please try again.");
      setIsLoadingMembers(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

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
    const response = await apiClient.delete(
      `/organization/${org_id}/member/${id}/delete/`
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
          title: "Member deleted successfully",
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

  const updateRole = async ({ id, role }: { id: string; role: string }) => {
    const response = await apiClient.put(
      `/organization/${org_id}/member/${id}/update/role/`,
      { role: role }
    );
    return response.data;
  };

  const { mutate: updateRoleMutation } = useMutation(updateRole, {
    onSuccess: () => {
      queryClient.invalidateQueries("members");
      toast({
        variant: "success",
        title: "Member role updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update role",
      });
    },
  });

  const fetchMembers = async (query: string) => {
    try {
      const response = await apiClient.get(
        `/organization/${org_id}/members/?q=${query}${
          role == "" ? "" : `&role=${role}`
        }`
      );

      if (response.data.status === 404) {
        setIsLoadingMembers(false);
        setError("No member(s) found for the specified search criteria. ");
        return;
      }
      // setError('search wrong')
      setError(null);
      return response.data.data;
    } catch (error) {
      setError("Failed to load members. Please try again.");
      console.error(error);
    }
  };

  const { mutate: searchMutation } = useMutation(fetchMembers, {
    onSuccess: (data) => {
      queryClient.setQueryData("members", data);
      dispatch(setMemberTableData(data));
    },
    onError: (error: any) => {
      console.error(error);
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

  const fetchRole = async (query: string) => {
    try {
      const response = await apiClient.get(
        `/organization/${org_id}/members/?role=${query}&role=${query}`
      );

      if (response.data.status === 404) {
        setIsLoadingMembers(false);
        setError("No member(s) found for the specified search criteria. ");
        return;
      }

      setError(null);
      return response.data.data;
    } catch (error) {
      setError("Failed to load members by role. Please try again.");
      console.error(error);
    }
  };

  const { mutate: searchRoleMutation } = useMutation(fetchRole, {
    onSuccess: (data) => {
      queryClient.setQueryData("members", data);
      dispatch(setMemberTableData(data));
      setSearchQuery("");
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  const debouncedRoleMembers = useCallback(
    debounce((query: string) => searchRoleMutation(query), 100),
    [searchRoleMutation]
  );

  const fetchrole = async (query: string) => {
    if (query == "all") {
      getMembers();
      return;
    }
    debouncedRoleMembers(query);
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
                    <SelectItem key={role.role} value={role.role}>
                      {role.role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                {loadingMembers && (
                  <TableCaption>
                    Loading members in your organization...
                  </TableCaption>
                )}
                {error && (
                  <TableCaption className="text-red-500">{error}</TableCaption>
                )}
                {!loadingMembers &&
                  !error &&
                  tableData &&
                  tableData.length === 0 && (
                    <TableCaption>
                      No member(s) found for this Organization...
                    </TableCaption>
                  )}
                {tableData && (
                  <MemberDataTable
                    data={tableData as any}
                    columns={MemberColumns}
                  />
                )}
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
          text={`Do you want to delete ${image?.member.first_name} from your organization`}
          noText="No"
          confirmText="Yes, Delete"
          confirmFunc={() => deleteMemberMutation(image?.member.id)}
        />
      </Dialog>
    </div>
  );
};

export default Images;
