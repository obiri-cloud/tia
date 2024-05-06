"use client";
import React, { FormEvent, useRef } from "react";
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

const InviteModal = ({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  const form = useForm();

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Input
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
            Send Invitation Link
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
};

export default InviteModal;
