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
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "react-query";
import AddImgGroupModal from "@/app/components/AddImgGroupModal";
import { useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateGroupModal from "@/app/components/CreateGroupModal";
// import NewImageForm from "./new-image-form";
import NewImageForm from "@/app/components/admin/new-image-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
// import { getImageListX } from "./overview";

import { getImageListX } from "@/app/components/admin/overview";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
// import DeleteConfirmation from "../delete-confirmation";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter, useSearchParams } from "next/navigation";
import { ILabImage, IinviteData, IOrgGroupData } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import AddMembersModal from "@/app/components/AddMembersModal";
import { Skeleton } from "@/components/ui/skeleton";
import AltRouteCheck from "@/app/components/alt-route-check";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrganizationGroupImagePage = () => {
  const { data: session } = useSession();
  const [image, setImage] = useState<any>();
  
  // const [imageList, setImagelist] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [members, setallMembers] = useState<any>([]);
  const [passedData, setPassedData] = useState<any>();
  const [gid, setgid] = useState<number>();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = params.id;
  const gids = params.gid;
  const name = searchParams.get("name");
  const group = searchParams.get("group_name");




  // get groups
  const getImagesInGroup =async (): Promise<ILabImage[] | undefined> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/group/${id}/image/list/?page=1`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
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

  //delete images in the group
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
       console.log({response})
      return response;
    } catch (error) {
      toast({
        variant: "destructive",
        //@ts-ignore
        title: error.response.data.detail,
      });
    }
  };

  const { data: imageList, isLoading: loadingMembers } = useQuery(
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
        console.log({responseData})
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
            href={`/dashboard/organizations`}
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
