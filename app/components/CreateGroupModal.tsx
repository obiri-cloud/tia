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
import { useSession } from "next-auth/react";
// import { getImageListX } from "./overview";
import { getImageListX } from "./admin/overview";
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

const NewImageForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;



  


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let name= nameRef.current?.value;

    const formSchema = z.object({
      name: z.string()
    });

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    let parseFormData = {
      name: nameRef.current?.value,
    };

    const formData = new FormData();

    // Append fields to the FormData object
    formData.append("name", nameRef.current?.value || "");

    // }

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/create/`,
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
        toast({
          variant: "success",
          title: `group created sucessfully`,
          description: ``,
        });
        router.push(`/my-organization/group`);
      } else {
        toast({
          variant: "destructive",
          title: "Invitation  Creation  Error",
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




  const handleOnEsc = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      dispatch(setCurrentImage(null));
    }
  };

  const handleOnClickOutside = (e: ContentProps["onPointerDownOutside"]) => {
    dispatch(setCurrentImage(null));
  };

  return (
    <DialogContent
      onEsc={(e) => handleOnEsc(e)}
      onClickOutside={(e) => handleOnClickOutside(e)}
      className="flex justify-center items-center overflow-y-scroll h-[40vh] "
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
                  Name Of Group
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name your group"
                    type="text"
                    {...field}
                    className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                    ref={nameRef}
                    defaultValue=''
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
          >
            {"Create Group"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewImageForm;
