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
import { useQuery } from "react-query";
import AddImgGroupModal from "@/app/components/AddImgGroupModal";
import { useEffect } from "react";
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
import useOrgCheck from "@/hooks/orgnization-check";

const OrganizationGroupImagePage = () => {
  const [image, setImage] = useState<any>();
  const [imageList, setImagelist] = useState<any>();
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

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;
  const gids = params.gid;
  const name = searchParams.get("name");
  const group = searchParams.get("group_name");
  const { data: session } = useSession();

  const isOrg = useOrgCheck();
  if (isOrg) {
    return null;
  }
  // get groups
  const getGroupMembers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${id}/image/list/?page=1`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  if(response.status===200){
      //     setstatus(true)
      //     return
      //  }
      console.log(response.data.data[0].lab_image);
      setImagelist(response.data.data[0].lab_image);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroupMembers();
  }, []);

  //get members
  const getmembers = async () => {
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
      //  if(response.status===200){
      //     setstatus(true)
      //     return
      //  }

      console.log({ response });
      setallMembers(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getOrgImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/images/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //  if(response.status===200){
      //     setstatus(true)
      //     return
      //  }

      setImage(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrgImages();
    getmembers();
  }, []);

  const deletebtn = (data: IOrgGroupData) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  //delete members in the group
  const deleteblink = async (data: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${id}/image/${data}/delete/`,
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
        getGroupMembers();
        toast({
          variant: "success",
          title: "Image Deleted Sucessfully",
          description: response.data.data,
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

  return (
    <div className="space-y-4 m-4">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>{group} List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <div>
              {!status && (
                <>
                  <Button
                    className="m-4"
                    onClick={() => {
                      setIsOpenViewDialog2(true);
                    }}
                  >
                    create group
                  </Button>
                </>
              )}
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
                    <TableHead className="">Email</TableHead>
                    <TableHead>Lab Name</TableHead>
                    {/* <TableHead>created_at</TableHead> */}
                    {/* <TableHead>expires</TableHead> */}
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {imageList?.length === 0 ||
                  (status && (
                    <TableCaption>
                     No Labs Available In this Group
                      <br />
                      <Button
                        className="m-4"
                        onClick={() => setIsOpenViewDialog2(true)}
                      >
                        Create group
                      </Button>
                    </TableCaption>
                  ))}
                <TableBody>
                  {imageList && imageList.length > 0 ? (
                    imageList.map((image: any, i: any) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {image.name}
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
          //@ts-ignore
          text={`Do you want to delete ${passedData?.name} from ${group} group ?`}
          noText="No"
          confirmText="Yes, Delete!"
          confirmFunc={() => deleteblink(passedData?.id)}
        />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen2}
        onOpenChange={
          isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
        }
      >
        <CreateGroupModal />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen1}
        onOpenChange={
          isOpenViewDialogOpen1 ? setIsOpenViewDialog1 : setIsOpenDeleteDialog
        }
      >
        <AddImgGroupModal image={image} gid={gid} />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen3}
        onOpenChange={
          isOpenViewDialogOpen3 ? setIsOpenViewDialog3 : setIsOpenDeleteDialog
        }
      >
        <AddMembersModal image={members} gid={gid} />
      </Dialog>
    </div>
  );
};

export default OrganizationGroupImagePage;
