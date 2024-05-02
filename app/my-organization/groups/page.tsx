"use client";
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
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
// import { getImageListX } from "./overview";

import { getImageListX } from "@/app/components/admin/overview";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { setCurrentImage } from "@/redux/reducers/adminSlice";
// import DeleteConfirmation from "../delete-confirmation";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter, useSearchParams } from "next/navigation";
import { ILabImage, IOrgGroupData, GroupMember } from "@/app/types";
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
import OrgDialog from "@/app/components/my-organization/org-dialog";
import { z } from "zod";

interface OrgGroup {
  id: string;
  name: string;
  organization: {
    name: string;
  };
}

const Images = () => {
  const [imageList, setimagelist] = useState<IOrgGroupData[]>();
  const [status, setstatus] = useState<boolean>(false);

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage[]>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] =
    useState<boolean>(false);
  const [isOpenViewDialogOpen3, setIsOpenViewDialog3] =
    useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =
    useState<boolean>(false);
  const [passedData, setPassedData] = useState<OrgGroup>();
  const [gid, setgid] = useState<number>();

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

      console.log("response.data.data", response.data.data);

      return response.data.data;
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

  const {
    isLoading: loadingMembers,
    error: errorMembers,
    data: members,
  } = useQuery(["members"], () => getMembers());

  const {
    isLoading: loadingGroups,
    error: errorGroups,
    data: groups,
  } = useQuery(["groups"], () => getGroups());

  const queryClient = useQueryClient();

  useEffect(() => {
    getOrgImages();
    // getMembers()
  }, []);

  const deletebtn = (data: OrgGroup) => {
    setPassedData(data);
    setIsOpenViewDialog(true);
  };

  //delete groups
  const deleteblink = async (data: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${data}/delete/`,
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
        getGroups();
        toast({
          variant: "success",
          title: "Group Deleted Sucessfully",
          description: response.data.data,
        });
      }

      console.log(response.data.data);
      setimagelist(response.data.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const createGroup = async (formData: FormData) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/create/`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    return response.data;
  };

  const {
    mutate: createGroupMutation,
    isLoading: updatingGroups,
    error: groupUpdateError,
  } = useMutation((formData: FormData) => createGroup(formData), {
    onSuccess: () => {
      queryClient.invalidateQueries("groups");
      (document.getElementById("group-name") as HTMLInputElement).value = "";
      toast({
        variant: "success",
        title: "Group created successfully",
        description: "",
      });
      setIsOpenViewDialog2(false);
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Group";
    },
    onError: (error: any) => {
      const responseData = error.response.data;
      toast({
        variant: "destructive",
        title: responseData.data,
      });
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Group";
    },
  });

  const createNewGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //@ts-ignore
    (document.getElementById("submit-button") as HTMLButtonElement).disabled =
      true;
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Group";
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Group...";
    const name = (document.getElementById("group-name") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("name", name || "");
    createGroupMutation(formData);
  };

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organzation</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>

        {
          //@ts-ignore
          session?.user && session?.user.data.is_admin ? (
            <Link href="/dashboard" className="font-medium text-mint">
              Go to dashboard
            </Link>
          ) : null
        }
      </div>
      <div className="grid gap-4 md:grid-cols-2 p-4">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <CardTitle>Organizations Groups</CardTitle>
            {!status && (
              <Button
                className="m-4"
                onClick={() => setIsOpenViewDialog2(true)}
              >
                Create group
              </Button>
            )}

            {/* <Dialog>
             <OrgDialog title="hello" onSubmit={()=>{}}>
              <p>hello</p>
             </OrgDialog>
            </Dialog> */}
          </CardHeader>
          <Dialog>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Group Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                {!loadingGroups && groups && groups.length === 0 ? (
                  <TableCaption>No groups in your organization...</TableCaption>
                ) : null}

                {loadingGroups ? (
                  <TableCaption>
                    Loading groups in your organization...
                  </TableCaption>
                ) : null}
                <TableBody>
                  {!loadingGroups
                    ? groups && groups.length > 0
                      ? groups.map((group: OrgGroup, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {group.name}
                            </TableCell>
                            <TableCell>{group.organization.name}</TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setgid(Number(group.id)),
                                        setIsOpenViewDialog3(true);
                                    }}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Add members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-medium cursor-pointer hover:text-white-500 text-white-500 py-2"
                                    onClick={() => {
                                      router.push(
                                        `/my-organization/groups/${group.id}/members?name=group&group_name=${group.name}`
                                      );
                                    }}
                                  >
                                    View members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="font-medium cursor-pointer hover:text-white-500 text-white-500 py-2"
                                    onClick={() => {
                                      router.push(
                                        `/my-organization/groups/${group.id}/images?name=Group&group_name=${group.name} Image`
                                      );
                                    }}
                                  >
                                    View Images
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deletebtn(group)}
                                    className="font-medium cursor-pointer hover:text-red-500 text-red-500 py-2"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setgid(Number(group.id)),
                                        setIsOpenViewDialog1(true);
                                    }}
                                    className="font-medium cursor-pointer hover:text-red-500 text-white-500 py-2"
                                  >
                                    Add Image(s)
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      : null
                    : null}
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
          text={`Do you want to delete  ${passedData?.name} group ? `}
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
        <CreateGroupModal onSubmit={createNewGroup} />
      </Dialog>

      <Dialog
        open={isOpenViewDialogOpen1}
        onOpenChange={
          isOpenViewDialogOpen1 ? setIsOpenViewDialog1 : setIsOpenDeleteDialog
        }
      >
        <AddImgGroupModal
          image={image}
          gid={gid}
          onSubmit={() => setIsOpenViewDialog1(false)}
        />
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

export default Images;

const AddButton = () => {
  const dispatch = useDispatch();

  return (
    <DialogTrigger onClick={() => dispatch(setCurrentImage(null))}>
      <Button>Add Image</Button>
    </DialogTrigger>
  );
};

// <Dialog>
// <DialogTrigger
//   onClick={() =>
//     dispatch(setCurrentImage(image))
//   }
// >
//   <Button
//     className="font-medium"
//     variant="link"
//   >
//     View
//   </Button>
// </DialogTrigger>
// <NewImageForm />
// </Dialog>
// |
// <Dialog>
// <DialogTrigger>
//   <Button
//     onClick={() => setImage(image)}
//     className="font-medium text-red-500"
//     variant="link"
//   >
//     Delete
//   </Button>
// </DialogTrigger>
// <DeleteConfirmation
//   image={image}
//   text="Do you want to delete this image"
//   noText="No"
//   confirmText="Yes, Delete this image"
//   confirmFunc={() => deleteImage(image?.id)}
// />
// </Dialog>
// |
// <Button
// onClick={() => router.push(`/admin/images/${image.id}/instructions`)}
// className="font-medium"
// variant="link"
// >
// Attach Instruction
// </Button>
