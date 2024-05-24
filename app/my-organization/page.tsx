"use client";
import React, { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
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

// import NewImageForm from "./new-image-form";
import NewImageForm from "@/app/components/admin/new-image-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "@/components/ui/use-toast";
// import { getImageListX } from "./overview";

import { getImageListX } from "@/app/components/admin/overview";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
// import DeleteConfirmation from "../delete-confirmation";
import DeleteConfirmation from "@/app/components/delete-confirmation";
import { useRouter } from "next/navigation";
import { ILabImage } from "@/app/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import CreateOrgModal from "@/app/components/CreateOrgModal"
import useOrgCheck from "@/hooks/orgnization-check";
import hasOrgCheck from "@/hooks/createOrgCheck";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const myOrganizationPage = () => {
  const name = useSelector((state: RootState) => state);
  
  let OrgExist=hasOrgCheck()
  console.log({ name });

  // const [orgImageList, setorgImagelist] = useState<ILabImage[]>();

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<ILabImage>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] = useState<boolean>(false);
  const [level,setlevel]=useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const [emptyQuery,setemptyQuery]=useState(false)
  const queryClient = useQueryClient();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  

  const debounce = (func:any, delay:any) => {
    let timeoutId:any;
    return (...args:any) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const getOrgImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/images/`,
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



  const createOrg = async (formData: FormData) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/create/`,
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
    mutate: createOrganizationMutation,
    isLoading: updating,
    error: UpdateError,
  } = useMutation((formData: FormData) => createOrg(formData), {
    onSuccess: () => {
      queryClient.invalidateQueries("orgName");
      router.push('/my-organization')
      setIsOpenViewDialog2(false);
      (document.getElementById("Org-name") as HTMLInputElement).value = "";
      toast({
        variant: "success",
        title: "Orgnaization created successfully",
        description: "",
      });
     
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Organization";
    },
    onError: (error: any) => {
      const responseData = error.response.data;
      toast({
        variant: "destructive",
        title: responseData.data,
      });
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Orgnaization";
    },
  });

  const createOrganization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (document.getElementById("submit-button") as HTMLButtonElement).disabled =
      true;
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Orgnaization";
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Organization...";
    const name = (document.getElementById("Org-name") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("name", name || "");
    createOrganizationMutation(formData);
  };



  const {
    data: orgImageList,
  } = useQuery(["orgImages"], () => getOrgImages());



  const fetchlabs = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/images/?q=${query}${level==''?'':`&difficulty_level=${level}` }`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        if(response.data.data==="No Lab(s) found for the specified search criteria")setemptyQuery(true)
        return response.data.data;
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

//fetch_role
const fetchRole = async (query: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BE_URL}/organization/${org_id}/images/?difficulty_level=${query}&difficulty_level=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};




const { mutate: searcRoleMutation } = useMutation(fetchRole, {
  onSuccess: (data) => {
    console.log({data:data})
    queryClient.setQueryData("orgImages", data);
    setSearchQuery('')
  },
  onError: (error: any) => {
    console.log(error);
  },
});

const fetchrole = (query: string) => {
  if(query=='all'){
    queryClient.invalidateQueries("orgImages");
    return
  }
   debouncedRoleMembers(query);
};

const debouncedRoleMembers = useCallback(debounce((query:string) => searcRoleMutation(query), 100), [searcRoleMutation]);


  
  
  const { mutate: searchMutation } = useMutation(fetchlabs, {
    onSuccess: (data) => {
      if (Array.isArray(data)) {
        queryClient.setQueryData("orgImages", data);
        setemptyQuery(false)
      } else {
        queryClient.setQueryData("orgImages", { status: data.status, message: data.message });
      }
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
  


  
  const debouncedfetchlabs = useCallback(debounce((query:string) => searchMutation(query), 400), [searchMutation]);
  
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedfetchlabs(query);
  };
  
  const difficulty_level=[
    {
      stage:"beginner",
    },
    {
      stage:"intermediate",
    },
    {
      stage:"hard",
    },
  ]



  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organzation</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        {
          session?.user && session?.user.data.is_admin ? (
            <Link href="/dashboard" className="font-medium text-mint">
              Go to dashboard
            </Link>
          ) : null
        }
      </div>

      <div className="grid gap-4 md:grid-cols-2 m-4 ">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row justify-between items-center w-full">
            <div>
              <CardTitle>Organization Lab List</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <Dialog>
              <NewImageForm />
            </Dialog>
          </CardHeader>
          <Dialog>

          <div className="flex items-center gap-4 m-5">
              <Input   
                        placeholder="Search labs"
                        value={searchQuery}
                        onChange={(e) => handleSearchQueryChange(e.target.value)}
              />
              <Select onValueChange={(newRole) => fetchrole(newRole)}>
                                <SelectTrigger className="w-[180px] bg-inherit">
                                  <SelectValue placeholder='Filter by role'/>
                                </SelectTrigger>

                                <SelectContent className="overflow-visible" >
                                  <SelectGroup >
                                    <SelectLabel>filter Role</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {

                                      difficulty_level.map((role:any)=>(
                                        <>
                                          <SelectItem value={role.stage}>{role.stage}</SelectItem>
                                        </>

                                      ))
                                    }
                                  </SelectGroup>
                                </SelectContent>
                </Select>
            </div>
            <CardContent className="pl-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Difficulty Level</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Port Number</TableHead>
                  </TableRow>
                </TableHeader>
                {orgImageList?.length === 0 && (
                  <TableCaption>No images found...</TableCaption>
                )}
              {emptyQuery&&(
                <TableCaption>No Lab(s) found for the specified search criteria</TableCaption>
              )}
                <TableBody>
                  {orgImageList
                    && orgImageList.length > 0
                        && Array.isArray(orgImageList) && orgImageList.map((image:ILabImage, i:number) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.name}
                            </TableCell>
                            <TableCell>{image.difficulty_level}</TableCell>
                            <TableCell>{image.duration}</TableCell>
                            <TableCell className="text-right">
                              {image.port_number}
                            </TableCell>
                          </TableRow>
                        ))
                    
                    }
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
        <NewImageForm />
      </Dialog>
    </div>
  );
};

export default myOrganizationPage;
