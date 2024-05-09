"use client";
import React, { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

const Images = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);

  const token = session?.user!.tokens?.access_token ?? "";
  const getMembers = async (): Promise<GroupMember[] | undefined | string> => {
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

  const { data: members, isLoading: loadingMembers,isError } = useQuery(
    ["members"],
    () => getMembers()
  );



  const deleteMember= async (id: number) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/member/${id}/delete/`,
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
          title: 'Member deleted Sucessfully',
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
console.log('iserror',isError,members)
  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organzation</span>
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
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                {loadingMembers ? (
                  <TableCaption>
                    Loading members in your organization...
                  </TableCaption>
                ) : null}
                {!loadingMembers && ( (members && members.length === 0) || members==='No members in the organization') ? (
                  <TableCaption> No members in your organization...</TableCaption>
                ) : null}
                <TableBody>
                  {!loadingMembers && Array.isArray(members) && members.length > 0
                      ? members.map((member: GroupMember) =>(
                          <TableRow key={member.member.id}>
                            <TableCell className="font-medium">
                              {member.member.email}
                            </TableCell>
                            <TableCell>{member.member.first_name} {member.member.last_name}</TableCell>
                            <TableCell>{member.invitation_status}</TableCell>
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
                      : null
                    }
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
