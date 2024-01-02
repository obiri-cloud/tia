"use client";
import React, { FC, FormEvent, forwardRef, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { getImageListX } from "./overview";

interface INewLabForm {
  labDetails: ILabList | null;
}
const NewLabForm: FC<INewLabForm> = ({ labDetails }) => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const deploymenNameRef = useRef<HTMLInputElement>(null);
  const ingressUrlRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
    deployment_name: z.string().min(3, {
      message: "Deployment name has to be 3 characters or more",
    }),
    ingress_url: z.string().min(3, {
      message: "Description has to be 3 characters or more",
    }),
    image: z.coerce.number().int({
        message: "Image field is required",
      }),
   
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    let formData = {
      name: nameRef.current?.value,
      deployment_name: deploymenNameRef.current?.value,
      ingress_url: ingressUrlRef.current?.value,
      image: imageRef.current?.value,
    };

    let axiosConfig = {
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${labDetails?.id}/update/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(formData),
    };

    try {
      formSchema.parse(formData);
      const response = await axios(axiosConfig);

      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: "Lab Update Success",
          description: "Image updated successfully",
        });
        getImageListX(token).then(() => {
          document.getElementById("closeDialog")?.click();
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lab Update Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("error", error);

      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Image Creation Error",
            description: err.message,
          })
        );
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  return (
    <DialogContent className="overflow-y-scroll">
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    type="text"
                    {...field}
                    className="glassBorder text-black"
                    ref={nameRef}
                    defaultValue={labDetails?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-6">
            <FormField
              control={form.control}
              name="deployment_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Name</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={true}
                      placeholder="Deployment Name"
                      type="text"
                      {...field}
                      className="glassBorder bg-gray-300 text-black"
                      ref={deploymenNameRef}
                      defaultValue={labDetails?.deployment_name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-6">
            <FormField
              control={form.control}
              name="ingress_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingress Url</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={true}

                      placeholder="ingress_url"
                      type="text"
                      {...field}
                      ref={ingressUrlRef}
                      defaultValue={labDetails?.ingress_url}
                      className="glassBorder bg-gray-300 text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                      readOnly={true}

                    type="text"
                    className="glassBorder bg-gray-300 text-black"
                    {...field}
                    ref={imageRef}
                    defaultValue={labDetails?.image}
                    placeholder="Image"
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
            {labDetails ? "Update" : "Save"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewLabForm;
