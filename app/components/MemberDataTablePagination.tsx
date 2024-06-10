import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import {  useQueryClient } from "react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMemberPageSize, setMemberTableData } from "@/redux/reducers/MemberTableSlice";
import { RootState } from "@/redux/store";
import { Table } from "@/components/ui/table";

interface DataTablePaginationProps<IinviteData> {
  //@ts-ignore
  table: Table<IinviteData>;
}

export function MemberDataTablePagination({
  table,
}: DataTablePaginationProps<any>) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { MemberPageSize: MemberTotalPageSize, MemberOriginalPageSize } = useSelector(
    (state: RootState) => state.memberTable
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(2);

  const org_id = session?.user!.data?.organization_id;
  const token = session?.user!.tokens?.access_token;

  const fetchInvitations = async (
    page: number,
    pageSize: number
  ): Promise<any | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/members/?page_size=${pageSize}`,
        {
          params: { page },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setMemberTableData(response.data.data));
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchInvitations(page, currentPageSize);
  };

  const handleRowChnage = async (value: string) => {
    {
      setCurrentPage(1);
      setCurrentPageSize(+value);
      dispatch(setMemberPageSize(Math.ceil(MemberOriginalPageSize / +value)));
      await fetchInvitations(1, +value);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground"></div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={handleRowChnage}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[1, 2, 20].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {MemberTotalPageSize}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button 

            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === MemberTotalPageSize}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(MemberTotalPageSize)}
            disabled={currentPage === MemberTotalPageSize}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
