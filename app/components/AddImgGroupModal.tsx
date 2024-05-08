"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import OrgDialog from "./my-organization/org-dialog";
import { GroupMember, ILabImage } from "../types";

const FormSchema = z.object({
  image: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

function AddImgGroupModal({
  image,
  gid,
  onSubmit,
}: {
  image: ILabImage[] | undefined;
  gid: number | undefined;
  onSubmit: () => void;
}) {
  console.log("image", image);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: [],
    },
  });

  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    let image_ids = { image_ids: data.image };
    (
      document.getElementById("add-image-to-grp-button") as HTMLButtonElement
    ).disabled = true;
    (
      document.getElementById("add-image-to-grp-button") as HTMLButtonElement
    ).textContent = "Adding Images...";

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${gid}/image/add/`,
      data: image_ids,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios(axiosConfig);
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Image added to Group sucessfully`,
          duration: 2000,
        });
        onSubmit();
      } else {
        toast({
          variant: "destructive",
          title: "image  adding  Error",
          description: response.data,
        });
      }
    } catch (error: any) {
      console.error("error", error);
      const responseData = error.response.data;
      if (error.response) {
        toast({
          variant: "destructive",
          title: `${responseData.data}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: `${responseData.data}`,
        });
      }
    } finally {
      (
        document.getElementById("add-image-to-grp-button") as HTMLButtonElement
      ).disabled = false;
      (
        document.getElementById("add-image-to-grp-button") as HTMLButtonElement
      ).textContent = "Add Images";
    }
  }

  return (
    <OrgDialog
      title="Group Images"
      description="Select the Images you want to add to the group"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                {image &&
                  image.map((item: ILabImage) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="image"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormLabel className="flex items-center space-x-4">
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked: any) => {
                                  console.log(checked, field);
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                              <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase  rounded-full">
                                {item.name[0]}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-black dark:text-white ">
                                  {`${item.name} `}
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}

                {image?.length === 0 || !image ? (
                  <p className="text-center text-black dark:text-white">
                    No image in your organization...
                  </p>
                ) : null}
              </FormItem>
            )}
          />
          <Button
            disabled={image?.length === 0 || !image ? true : false}
            id="add-image-to-grp-button"
            type="submit"
            className="w-full"
          >
            Add Images
          </Button>
        </form>
      </Form>
    </OrgDialog>
  );
}

export default AddImgGroupModal;
