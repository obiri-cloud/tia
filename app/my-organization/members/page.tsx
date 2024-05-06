"use client";
import React, { ChangeEvent, FC, FormEvent, SVGProps, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useQuery } from "react-query"; 
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

const Images = () => {
  const { imageCount} = useSelector(
    (state: RootState) => state.admin
  );

  const [imageList,setimagelist]=useState<any>();
  const [status,setstatus]=useState<boolean>(false)

  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [image, setImage] = useState<any>();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);
  
  const isOrg = useOrgCheck();
  if (isOrg) {
    return null;
  }
  
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


  const getImages = async () => {
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


       if(response.data.status===204){
           setstatus(true)
           return
       }
       console.log({response:response.data.data});
       setimagelist(response.data.data)
      return response;
    } catch (error) {
       console.log(error)
    }
  };

  useEffect(()=>{
    getImages()
  },[])

  const deletelink=async(data:any)=>{
    try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BE_URL}/organization/member/${data}/delete/`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              // @ts-ignore
              Authorization: `Bearer ${token}`,
            },
          }
        );
         if(response.data.status===204){
            toast({
                variant:  "success",
                title: "Invitation Deleted Sucessfully",
                description: response.data.data,
              });
              setIsOpenViewDialog(false)
              getImages()
         }
  
         console.log({response});
        setimagelist(response.data.data)
        return response;
      } catch (error) {
         console.log(error)
      }
  }

  console.log({image});
  

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
            <div>
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                {/* You have {imageCount} image(s). */}
              </CardDescription>
            </div>
            <div>
            {!status && (
              <>
                <Button className="m-4">Invite members</Button>
              </>
            )
            }
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
                    <TableHead>First Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                {imageList?.length === 0 || status && (
                  <TableCaption>
                     No Members Found In This Organization 
                    <br />
                    <Button className="m-4" onClick={()=>setIsOpenViewDialog(true)}>invite members</Button>
                  </TableCaption>
                )}
                <TableBody>
                  {imageList
                    ? imageList.length > 0
                      ? imageList.map((image:any, i:any) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {image.member.email}
                            </TableCell>
                            <TableCell>{image.member.first_name}</TableCell>
                            <TableCell>{image.invitation_status}</TableCell>
                            <TableCell className="text-right">
                              {image.port_number}
                            </TableCell>
                            <TableCell className="underline font-medium text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreVerticalIcon className="w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="left-[-20px_!important]">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsOpenViewDialog(true);
                                    }}
                                    className="cursor-pointer py-2"
                                  >
                                    Add to group
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsOpenDeleteDialog(true);
                                      setImage(image);
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
        <InviteModal/>
      </Dialog>

      <Dialog
        open={isOpenDeleteDialogOpen}
        onOpenChange={
          isOpenDeleteDialogOpen ? setIsOpenDeleteDialog  : setIsOpenViewDialog
        }
      >
        <DeleteConfirmation
          image={image}
          text={`Do you want to delete ${image?.member.first_name} from your organizatio`}
          noText="No"
          confirmText="Yes, Delete "
          confirmFunc={() => deletelink(image?.member.id)}
        />
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






import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import PrismComponent from "@/app/components/PrismComponent";
import { ContentProps, IInstruction } from "@/app/types";
import { Label } from "@/components/ui/neo-label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CustomIframe from "@/app/components/custom-iframe";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import InviteModal from "@/app/components/InviteModal";
import useOrgCheck from "@/hooks/orgnization-check";

const ReviewDrawer = () => {
  const ratings = [
    {
      value: "1",
      label: "1 - Poor",
    },
    {
      value: "2",
      label: "2 - Fair",
    },
    {
      value: "3",
      label: "3 - Good",
    },
    {
      value: "4",
      label: "4 - Very Good",
    },
    {
      value: "5",
      label: "5 - Excellent",
    },
  ];

  const { data: session } = useSession();
  //@ts-ignore
  const token = session?.user!.tokens?.access_token;
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("image");
  const [value, setValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = useState<string>("");

  const handleOnEsc = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      router.push("/dashboard");
    }
  };

  const handleOnClickOutside = (e: ContentProps["onPointerDownOutside"]) => {
    router.push("/dashboard");
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === "") {
      toast({
        variant: "destructive",
        title: "Select a rating or click out the modal to exit.",
      });
    }
    let formData = { comments: comment, review: value, image: id, user: "" };

    let formSchema = z.object({
      image: z.string().optional(),
      comments: z.string().optional(),
      review: z.string().optional(),
      user: z.string().optional(),
    });

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/lab/review/create/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Review submitted.",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "An error occured when submitting your review.",
            description: err.message,
          })
        );
      }
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "An error occured when submitting your review.",
          description: error?.response?.data.message,
        });
      }
    } finally {
      // if (buttonRef.current) {
      //   buttonRef.current.disabled = false;
      // }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="visible absolute top-[-1000px]"
          id="sheet-trigger"
        ></Button>
      </DialogTrigger>
      <DialogContent
        onEsc={(e) => handleOnEsc(e)}
        onClickOutside={(e) => handleOnClickOutside(e)}
      >
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white font-bold text-xl">
            Review this lab
          </DialogTitle>
          <DialogDescription>
            Your reviews help us make the lab better for other users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitReview} className="grid gap-4 py-4 text-black">
          <div className="">
            <Label htmlFor="name" className=" block">
              Rating
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className=" mt-1 justify-between dark:bg-comboBg bg-white theme-selector w-full
                  glassBorder  bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder  fbdyXp  focus-visible:ring-ring focus-visible:ring-offset-0 p-[12px_16px] resize-none
                  
                  "
                >
                  {value
                    ? ratings.find((rating) => rating.value == value)?.label
                    : "Select rating..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No ratings found.</CommandEmpty>
                  <CommandGroup className="dark:bg-comboBg bg-white">
                    {ratings.map((rating) => (
                      <CommandItem
                        key={rating.value}
                        value={rating.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                        className="capitalize"
                      >
                        {rating.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === rating.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <div className="relative">
              <Textarea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                className="glassBorder  bg-white dark:bg-dashboardDarkInput dark:border-dashboardDarkInputBorder border-dashboardLightInputBorder border text-whiteDark dark:text-dashboardLightInputBorder  fbdyXp  focus-visible:ring-ring focus-visible:ring-offset-0 p-[12px_16px] resize-none"
                placeholder="Leave a review"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Submit</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ForwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <title />
    <g>
      <path d="M1,16A15,15,0,1,1,16,31,15,15,0,0,1,1,16Zm28,0A13,13,0,1,0,16,29,13,13,0,0,0,29,16Z" />
      <path d="M12.13,21.59,17.71,16l-5.58-5.59a1,1,0,0,1,0-1.41h0a1,1,0,0,1,1.41,0l6.36,6.36a.91.91,0,0,1,0,1.28L13.54,23a1,1,0,0,1-1.41,0h0A1,1,0,0,1,12.13,21.59Z" />
    </g>
  </svg>
);

const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <title />
    <g>
      <path d="M31,16A15,15,0,1,1,16,1,15,15,0,0,1,31,16ZM3,16A13,13,0,1,0,16,3,13,13,0,0,0,3,16Z" />
      <path d="M19.87,10.41,14.29,16l5.58,5.59a1,1,0,0,1,0,1.41h0a1,1,0,0,1-1.41,0L12.1,16.64a.91.91,0,0,1,0-1.28L18.46,9a1,1,0,0,1,1.41,0h0A1,1,0,0,1,19.87,10.41Z" />
    </g>
  </svg>
);
