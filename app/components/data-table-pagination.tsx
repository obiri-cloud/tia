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
import { useQuery, useMutation, useQueryClient } from "react-query";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTableData } from "@/redux/reducers/tableSlice";
import { RootState } from "@/redux/store";
import { Table } from "@/components/ui/table";

interface DataTablePaginationProps<IinviteData> {
  //@ts-ignore
  table: Table<IinviteData>;
}

export function DataTablePagination<IinviteData>({
  table,
}: DataTablePaginationProps<IinviteData>) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { data: tableData } = useSelector((state: RootState) => state.table);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [pageSize,setpageSize]=useState(2)

  const queryClient = useQueryClient();

  const org_id = session?.user!.data?.organization_id;
  const token = session?.user!.tokens?.access_token;

  const fetchInvitations = async (page: number): Promise<IinviteData[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/list/?page_size=${pageSize}`,
        {
          params: { page },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTotalData(response.data.count);
      setTotalPages(Math.ceil(response.data.count / pageSize)); 
      dispatch(setTableData(response.data.data));
      return ;
    } catch (error) {
      console.log(error);
    }
  };

  // const { data: invites, isLoading: loadingInvitations } = useQuery(
  //   ["invites", currentPage],
  //   () => fetchInvitations(currentPage),
  //   {
  //     // keepPreviousData: true,
  //     onSuccess: (data) => {
  //       if (data) {
  //       
  //       }
  //     },
  //   }
  // );

  const handlePageChange =async (page: number) => {
    setCurrentPage(page);
    await fetchInvitations(page)
  };


  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              setpageSize(Number(value))
              setTotalPages( Math.ceil(totalData / Number(value) )) 
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[1, 2, 20].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
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
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
