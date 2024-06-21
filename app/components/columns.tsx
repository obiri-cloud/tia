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
import apiClient from "@/lib/request";

dayjs.extend(relativeTime);

export const columns: ColumnDef<IinviteData>[] = [
  {
    accessorKey: "recipient_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.recipient_email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "invitation_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dayjs(row?.original?.created_at).fromNow()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {dayjs(row?.original?.expires).fromNow()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const [diag, setdiag] = useState<boolean>();
      const { data: tableData } = useSelector(
        (state: RootState) => state.table
      );
      const [_, setIsOpenDeleteDialog] = useState<boolean>(false);
      const { data: session } = useSession();
      const dispatch = useDispatch();
      console.log(tableData);
      const token = session?.user!.tokens?.access_token;
      const org_id = session?.user!.data?.organization_id;
      const [passedData, setPassedData] = useState<IinviteData>();

      const deleteInvite = async (id: number) => {
        const response = await apiClient.delete(
          `/organization/${org_id}/invitation/${id}/delete/`
        );

        const newData = tableData.filter((item: any) => item.id !== id);

        dispatch(setTableData(newData));

        return response.data.data;
      };

      const deletebtn = (data: IinviteData) => {
        setPassedData(data);
        setdiag(true);
      };

      const deleteInviteMutation = async (data: any) => {
        console.log("data", data);
        setdiag(false);
        toast({
          variant: "destructive",
          title: data.message || "Invitation deleted successfully",
        });
        await deleteInvite(data);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVerticalIcon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="left-[-20px_!important]">
              <DropdownMenuItem
                onClick={() => deletebtn(row.original)}
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
              text={`Do you want to delete ${passedData?.recipient_email} invitation`}
              noText="No"
              confirmText="Yes, Delete!"
              confirmFunc={() => deleteInviteMutation(passedData?.id ?? 0)}
            />
          </Dialog>
        </>
      );
    },
  },
];
