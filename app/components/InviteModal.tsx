"use client";
import React, { FormEvent, useRef} from "react";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import * as z from "zod";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import OrgDialog from "./my-organization/org-dialog";

type InviteModalProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  bulkEmails: any[]; 
  onRemoveEmail: (email: string) => void; 
};
const InviteModal = ({ onSubmit, bulkEmails,onRemoveEmail  }: InviteModalProps) => {
  const form = useForm();
  const {register}=useForm()

console.log({bulkEmails});

  return (
    <OrgDialog
      title="Invite Members"
      description="Invites users to your organization"
    >

      <Form {...form}>
        <form
          onSubmit={(e) => onSubmit(e)}
          className=" w-full dark:text-white text-black"
        >
<div className="flex flex-wrap gap-2 mb-4 justify-center">
  {bulkEmails.map((email, index) => (
    <div key={index} className="flex items-center  dark:bg-white dark:text-blackoverflow-hidden text-white bg-black rounded p-2">
      <div className="mr-2  dark:text-white w-32 overflow-hidden text-white text-ellipsis whitespace-nowrap">
        {email.email}
      </div>
      <button
        type="button"
        onClick={() => onRemoveEmail(email)}
        className="bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs"
      >
        x
      </button>
    </div>
  ))}
</div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Input
                 {...register('email', { required: true })} 
                  id="invite-email"
                  placeholder="Email"
                  type="text"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  defaultValue=""
                />
              </FormItem>
            )}
          />
         <Button
            id="submit-button"
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
          >
            Add Email
          </Button>

          <Button
            id="submit-button"
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
          >
            Send Invitation Link
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
};

export default InviteModal;
