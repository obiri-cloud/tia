"use client";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useQuery } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import DeleteConfirmation from "@/app/components/delete-confirmation";
import {  useSearchParams } from "next/navigation";
import { GroupMember,IOrgGroupData } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AltRouteCheck from "@/app/components/alt-route-check";
import { OrgGroup } from "../../page";
import AttachMemberToGroup from "@/app/components/AttachMemberToGroup";

const OrganizationGroupMembersPage = () => {
  const [imageList, setImagelist] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);

  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<any>();

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;

  const group = searchParams.get("group_name");
  const { data: session } = useSession();

  const deletebtn = (data: IOrgGroupData) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };
  const org_id = session?.user!.data?.organization_id;
  //delete members in the group
  const deleteblink = async (data: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/group/${id}/member/${data}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 204) {
        setIsOpenViewDialog(false);
        toast({
          variant: "success",
          title: "member Deleted Sucessfully",
          description: response.data.data || response.data.detail,
        });
      }

      setImagelist(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getGroups = async (): Promise<OrgGroup[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/list/`,
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
    } catch (error) {
      console.log(error);
    }
  };

  const {
    isLoading: loadingGroups,
    error: errorGroups,
    data: groups,
  } = useQuery(["groups"], () => getGroups());

  const getMembers = async (): Promise<GroupMember[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/members/`,
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
    } catch (error) {
      console.log(error);
    }
  };

  const { data: members, isLoading: loadingMembers } = useQuery(
    ["members"],
    () => getMembers()
  );

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <Link
            href={`/dashboard/organizations`}
            className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
          >
            Organizations
          </Link>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          <Link
            className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
            href={`/my-organization/groups`}
          >
            Groups
          </Link>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />

          {group ? (
            <span className="p-2 rounded-md">{group}</span>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
        </div>
        <AltRouteCheck />
      </div>

      <div className="grid gap-4 md:grid-cols-2 p-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>{group} Group List</CardTitle>
              <CardDescription></CardDescription>
            </div>
          </CardHeader>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Email</TableHead>
                    <TableHead>Name</TableHead>

                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imageList && imageList.length > 0 ? (
                    imageList.map((image: any, i: any) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {image.email}
                        </TableCell>
                        <TableCell>{image.first_name}</TableCell>
                        {/* <TableCell>{image.created_at}</TableCell>
                        <TableCell>{image.expires}</TableCell> */}
                        <TableCell className="underline font-medium text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVerticalIcon className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="left-[-20px_!important]">
                              {/* <DropdownMenuItem
                                onClick={()=>{setgid(image.id),setIsOpenViewDialog3(true)}}
                                className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                >
                                add members
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                className="font-medium cursor-pointer hover:text-white-500 text-white-500 py-2"
                                >
                                View
                                </DropdownMenuItem> */}
                              <DropdownMenuItem
                                onClick={() => deletebtn(image)}
                                className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                              >
                                Delete
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem
                                onClick={()=>{setgid(image.id),setIsOpenViewDialog1(true)}}
                                className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                >
                                add image
                                </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No members in this group
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Dialog>
        </Card>
      </div>

      <Dialog
        open={isOpenViewDialogOpen}
        onOpenChange={
          isOpenViewDialogOpen ? setIsOpenViewDialog : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          text={`Do you want to delete ${passedData?.first_name} from ${group} group ?`}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteblink(passedData?.id)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenViewDialog
        }
      >
        <AttachMemberToGroup groups={groups} onSubmit={() => {}} />
      </Dialog>
    </div>
  );
};

export default OrganizationGroupMembersPage;
