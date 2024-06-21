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

interface UpdateGroupNameModalProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  updateData: any;
}

const UpdateGroupNameModal: React.FC<UpdateGroupNameModalProps> = ({
  onSubmit,
  updateData,
}) => {
  const form = useForm();

  console.log({ updateData });

  return (
    <OrgDialog
      title="Update Group Name"
      description="Please update your group name"
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
                    placeholder={`${updateData.name}`}
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
            id="create-group-submit-button"
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
          >
            Update Group Name
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
};

export default UpdateGroupNameModal;
