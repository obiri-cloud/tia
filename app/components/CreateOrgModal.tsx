"use client";
import React, { FormEvent } from "react";
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

import { useSession } from "next-auth/react";
import OrgDialog from "./my-organization/org-dialog";

const CreateOrgModal = ({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  const form = useForm();

  // const OrganizationName = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  return (
    <OrgDialog title="Create Organization" description="">
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
                    defaultValue=""
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
            Create Organization
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
};

export default CreateOrgModal;
