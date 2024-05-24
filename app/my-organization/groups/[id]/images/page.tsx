"use client";
import { userCheck } from "@/lib/utils";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewImageForm from "@/app/components/admin/new-image-form";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";

import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter, useSearchParams } from "next/navigation";
import { ILabImage,  IOrgGroupData } from "@/app/types";
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

const OrganizationGroupImagePage = () => {
  const { data: session } = useSession();
  
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<any>();


  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const id = params.id;
  const name = searchParams.get("name");
  const group = searchParams.get("group_name");



  const getImagesInGroup =async (): Promise<ILabImage[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/group/${id}/image/list/?page=1`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

       return response.data.data[0].lab_image
    } catch (error) {
      console.log(error);
    }
  };



  const deletebtn = (data: IOrgGroupData) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  const deleteGroupImage = async (data:number) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/group/${id}/image/delete/`,
        {
            image_ids: [data]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: imageList } = useQuery(
    ["ImagesInGroup"],
    () => getImagesInGroup()
  );


  const { mutate: deleteGroupImageMutation } = useMutation(
    (id: number) => deleteGroupImage(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ImagesInGroup");
        setIsOpenViewDialog(false);
        toast({
          variant: "success",
          title: 'Image  deleted Sucessfully',
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
          {name ? (
            <Link
              className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
              href={`/my-organization/groups`}
            >
              {name}
            </Link>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />

          {group ? (
            <span className="p-2 rounded-md">{group}</span>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
        </div>
        <AltRouteCheck />
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>{group} List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <Dialog>
              <NewImageForm />
            </Dialog>
          </CardHeader>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Lab Name</TableHead>
                    <TableHead>Difficulty level</TableHead>
                    <TableHead>Duration</TableHead>
                    {/* <TableHead>created_at</TableHead> */}
                    {/* <TableHead>expires</TableHead> */}
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imageList && imageList.length > 0 ? (
                    imageList.map((image: any, i: any) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {image.name}
                        </TableCell>
                        <TableCell className="capitalize">{image.difficulty_level}</TableCell>
                        <TableCell>{image.duration}</TableCell>
                        <TableCell className="underline font-medium text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVerticalIcon className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="left-[-20px_!important]">
                     
                              <DropdownMenuItem
                                onClick={() => deletebtn(image)}
                                className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                         No Labs Available In this Group
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
          isOpenViewDialogOpen ? setIsOpenViewDialog : setIsOpenDeleteDialog
        }
      >
        <DeleteConfirmation
          
          text={`Do you want to delete ${passedData?.name} from ${group} group ?`}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteGroupImageMutation(Number(passedData?.id))}
        />
      </Dialog>
    </div>
  );
};

export default OrganizationGroupImagePage;
