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
import { setOrgData } from "@/redux/reducers/OrganzationSlice";
import OrgDialog from "./my-organization/org-dialog";

// interface NewImageFormProps {
//     OrgExist: boolean;
//     setOrgExist: (value: boolean) => void;
//   }

const CreateOrgModal= ({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) => {
  const form = useForm();

  // const OrganizationName = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  return (
    <OrgDialog
      title="Create Organization"
      description=""
    >
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className=" w-full dark:text-white text-black"
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
                    id="Org-name"
                    placeholder="Type Your Organization Name"
                    type="text"
                    {...field}
                    className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                    defaultValue=''
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            id="submit-button"
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
          >
            {"create organization"}
          </Button>
        </form>
      </Form>
      </OrgDialog>
  );
};

export default CreateOrgModal ;
