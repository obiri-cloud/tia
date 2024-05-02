"use client";
import React, { FormEvent } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import OrgDialog from "./my-organization/org-dialog";

const CreateGroupModal = ({
  onSubmit,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
  const form = useForm();


  return (
    <OrgDialog
      title="Create a group"
      description="Separete your members into manageable groups"
    >
      <Form {...form}>
        <form
        id="create-group-form"
          onSubmit={(e) => onSubmit(e)}
          className=" w-full dark:text-white text-black"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="group-name"
                    placeholder="Name your group"
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
            Create Group
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
};

export default CreateGroupModal;
