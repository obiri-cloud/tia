"use client";
import React, { FC, FormEvent, useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
// import { getImageListX } from "./overview";
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import trash from "@/public/svgs/trash.svg";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ContentProps, ILabImage } from "@/app/types";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";

const NewImageForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [isOpenViewDialogOpen, setIsOpenViewDialog] = useState<boolean>(false);
  const [isOpenViewDialogOpen2, setIsOpenViewDialog2] = useState<boolean>(true);
  const [isOpenViewDialogOpen1, setIsOpenViewDialog1] = useState<boolean>(false);
  const [isOpenDeleteDialogOpen, setIsOpenDeleteDialog] =useState<boolean>(false);

  const OrganizationName = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let name = OrganizationName.current?.value;

    const formSchema = z.object({
      name: z.string(),
    });
  
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    let parseFormData = {
      name: OrganizationName.current?.value,
    };

    const formData = new FormData();

    // Append fields to the FormData object
    formData.append("name", OrganizationName.current?.value || "");

    // }

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/create/`,
      data:formData,
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    };


    try {
      formSchema.parse(parseFormData);
      const response = await axios(axiosConfig);
      console.log({response});
      

      if (response.status === 201 || response.status === 200) {
        router.push(`/my-organization/organizationImages`);
        toast({
          variant: "success",
          title: `Organization Created Sucessfully`,
          description: ``,
        });

      } else {
        toast({
          variant: "destructive",
          title: "Organization Creation  Error",
          description: response.data.data,
        });
      }
    } catch (error:any) {
      console.error("error", error);
      const responseData = error.response.data;
      if (error.response) {
        toast({
          variant: "destructive",
          title: `${responseData.data}`,
          // description: responseData.message || "An error occurred",
        });
      } else {
        toast({
          variant: "destructive",
          title: `${responseData.data}`,
          // description: error.message || "An error occurred",
        });
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  function removeNullFields(obj: any) {
    for (const key in obj) {
      if (obj[key] === "null") {
        delete obj[key];
      }
    }
    return obj;
  }

  return (
    <Dialog
     open={isOpenViewDialogOpen2}
     onOpenChange={
        isOpenViewDialogOpen2 ? setIsOpenViewDialog2 : setIsOpenDeleteDialog
      }
    >
  <DialogContent
      className="flex justify-center items-center overflow-y-scroll h-[60vh] "
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] container w-full dark:text-white text-black"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" formTextLight">
                  Name of organization
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    type="text"
                    {...field}
                    className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                    ref={OrganizationName}
                    defaultValue='tiablabs'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            ref={buttonRef}
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
            onClick={handleSubmit}
          >
            {"create organization"}
          </Button>
        </form>
      </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewImageForm;
