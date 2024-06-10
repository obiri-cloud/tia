"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { IinviteData } from "@/app/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { setTableData } from "@/redux/reducers/tableSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import DeleteConfirmation from "./delete-confirmation";
import { RootState } from "@/redux/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { setMemberOriginalPageSize, setMemberPageSize, setMemberTableData } from "@/redux/reducers/MemberTableSlice";

dayjs.extend(relativeTime);

export const MemberColumns: ColumnDef<any>[] = [
  {
    accessorKey: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.member?.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
        console.log({row});
        
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.member?.first_name} {row?.original?.member?.last_name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.invitation_status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
        const { data: session } = useSession()
        const token = session?.user!.tokens?.access_token ?? "";
        const org_id = session?.user!.data?.organization_id;
        const { Memberdata: tableData } = useSelector((state: RootState) => state.memberTable);
        const queryClient = useQueryClient();
        const dispatch=useDispatch()


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

            const updatedData = tableData.map((member:any) =>
                member.member.id === id ? { ...member, role: role } : member
            )
    
              dispatch(setMemberTableData(updatedData));
    
            return response.data;
        };



        const { mutate: updateRoleMutation } = useMutation(updateRole, {
            onSuccess: () => {
        
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

      return (

        <TooltipProvider>
        <TableCell>
          <Select
            value={row?.original?.role}
            onValueChange={(newRole) =>
              updateRoleMutation({
                id: row?.original?.member.id,
                role: newRole,
              })
            }
          >
            <SelectTrigger className="w-[180px] bg-inherit">
              <SelectValue
                placeholder={`${row?.original?.role}`}
              />
            </SelectTrigger>
            <SelectContent className="overflow-visible">
              <SelectGroup>
                <SelectLabel>Assign Role</SelectLabel>
                {ROLES.map((role: any) => (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectItem value={role.role}>
                        {role.role}
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

      );
    },


  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
        const [image, setImage] = useState<any>();
        const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
        const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);
        

      const [diag, setdiag] = useState<boolean>();
      const { data: tableData } = useSelector(
        (state: RootState) => state.table
      );
      const { data: session } = useSession();
      const dispatch = useDispatch();
      console.log(tableData);
      const token = session?.user!.tokens?.access_token;
      const org_id = session?.user!.data?.organization_id;
      const [passedData, setPassedData] = useState<IinviteData>();

      const deleteMember = async (id: number) => {

        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/member/${id}/delete/`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newData = tableData.filter((item: any) => item.member.id !== id);
        dispatch(setMemberTableData(newData));

        return response.data.data;
      };

      const deletebtn = (data: any) => {
        setPassedData(data);
        setdiag(true);
      };

      const deleteMemberMutation = async (data: any) => {
        console.log("data", data);
        setdiag(false);
        toast({
          variant: "destructive",
          title: data.message || "Member deleted successfully",
        });
        await deleteMember(data);
      };

      return (
        <>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                              <MoreVerticalIcon className="w-4 h-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="left-[-20px_!important]">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setdiag(true);
                                    setImage(row?.original?.member);
                                  }}
                                  className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
         <Dialog
            open={diag}
            onOpenChange={diag ? setdiag : setIsOpenDeleteDialog}
          >
        <DeleteConfirmation
          text={`Do you want to delete ${image?.first_name} from your organization`}
          noText="No"
          confirmText="Yes, Delete"
          confirmFunc={() => deleteMemberMutation(image?.id)}
        />
      </Dialog>
        </>
      );
    },
  },
];
