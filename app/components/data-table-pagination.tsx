import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setTableData } from "@/redux/reducers/tableSlice";
import { RootState } from "@/redux/store";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";

interface DataTablePaginationProps<IinviteData> {
  table: Table<IinviteData>;
}

export function DataTablePagination<IinviteData>({
  table,
}: DataTablePaginationProps<IinviteData>) {
  const { data: session } = useSession();
  const dispatch = useDispatch()
  const { data:nextbtn } = useSelector((state: RootState) => state.nextbtn);
  const { data: tableData } = useSelector((state: RootState) => state.table);

  const queryClient = useQueryClient();


  const org_id = session?.user!.data?.organization_id;
  const token = session?.user!.tokens?.access_token;
  console.log({tableData});
  
  const getInvitations = async (
    page: number
  ): Promise<IinviteData[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/invitation/list/?page=${page}&page_size=${2}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response.data.data", response.data.data);
      let data = response.data.data
      dispatch(setTableData([...tableData, data]))
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }; 
  
  const { mutate: nextMutation } = useMutation(
    (page: any) => getInvitations(page),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invites");
      },
      onError: (error: any) => {
        const responseData = error.response.data;
      },
    }
  );



  const handleNext = async () => {
    table.nextPage();
    let nextPage = table.getState().pagination.pageIndex + 1;
    nextMutation(nextPage)
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            // value={"3"}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}

            //  onValueChange={(value) => {
            //   table.setPageSize(3);
            // }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5,3,1].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />

          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNext}
            disabled={!nextbtn}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
