"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { IinviteData } from "@/app/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  setOriginalPageSize,
  setPageSize,
  setTableData,
} from "@/redux/reducers/tableSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import DeleteConfirmation from "./delete-confirmation";
import { RootState } from "@/redux/store";
import apiClient from "@/lib/request";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime);

export const columns: ColumnDef<IinviteData>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const [selected, setSelected] = useState(false);
      const [diag, setdiag] = useState<boolean>(false);
      const { data: tableData } = useSelector(
        (state: RootState) => state.table
      );
      const { data: session } = useSession();
      const dispatch = useDispatch();
      const token = session?.user!.tokens?.access_token;
      const org_id = session?.user!.data?.organization_id;

      const handleSelectAll = (value: boolean) => {
        table.toggleAllPageRowsSelected(!!value);
        setSelected(!!value);
      };

      console.log("tb", tableData.length == 0);

      useEffect(() => {
        const subscription = table.getState().rowSelection;
        setSelected(Object.keys(subscription).length > 0);
      }, [table.getState().rowSelection]);

      const delData = table
        .getFilteredSelectedRowModel()
        .rows.map((a) => a.original.id);

      console.log("typeof---->", typeof delData, delData);

      const getInvitations = async (): Promise<IinviteData[] | undefined> => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/list/?page_size=2`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                // @ts-ignore
                Authorization: `Bearer ${token}`,
              },
            }
          );

          dispatch(setTableData(response.data.data));
          dispatch(setPageSize(Math.ceil(response.data.count / 2)));
          dispatch(setOriginalPageSize(response.data.count));

          return response.data.data;
        } catch (error) {
          console.log(error);
        }
      };

      const deleteInvite = async (id: number) => {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/delete/`,
          {
            invitation_ids: delData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newData = tableData.filter(
          (item: any) => !delData.includes(item.id)
        );
        dispatch(setTableData(newData));

        return response.data.data;
      };

      const deleteInviteMutation = async (data: any) => {
        table.toggleAllPageRowsSelected(false);
        setSelected(false);
        setdiag(false);
        toast({
          variant: "destructive",
          title: data.message || "Invitation deleted successfully",
        });
        await deleteInvite(data);
        await getInvitations();
      };

      return (
        <div className="flex gap-2 items-center">
          {tableData.length === 0 ? null : (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => handleSelectAll(!!value)}
              aria-label="Select all"
              className="translate-y-[2px]"
            />
          )}

          {selected ? (
            <Button
              variant="outline"
              id="closeDialog"
              size="icon"
              className="text-red-500"
              onClick={() => setdiag(true)}
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
              <p className="sr-only">Delete</p>
            </Button>
          ) : null}

          <Dialog open={diag} onOpenChange={setdiag}>
            <DeleteConfirmation
              text={`Do you want to delete these invitations`}
              noText="No"
              confirmText="Yes, Delete!"
              confirmFunc={() => deleteInviteMutation(delData)}
            />
          </Dialog>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "recipient_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient Email" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row?.original?.recipient_email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "invitation_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row?.original?.invitation_status}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {dayjs(row?.original?.created_at).fromNow()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "expires_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {dayjs(row?.original?.expires).fromNow()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const [diag, setdiag] = useState<boolean>(false);
      const { data: tableData } = useSelector(
        (state: RootState) => state.table
      );
      const { data: session } = useSession();
      const dispatch = useDispatch();
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
          <Dialog open={diag} onOpenChange={setdiag}>
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

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
