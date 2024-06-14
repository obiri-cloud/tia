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

export const labsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Difficulty level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Difficulty level" />
    ),
    cell: ({ row }) => {
        console.log({row});
        
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.difficulty_level} 
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.duration}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Port Number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Port Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row?.original?.port_number}
          </span>
        </div>

      );
    },
  },
];
