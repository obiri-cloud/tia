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
import { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";

const formSchema = z.object({
  image: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

function AddMembersModal(image: any) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: [],
    },
  });

  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let user_ids = { user_ids: data.image };

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${image.gid}/member/add/`,
      data: user_ids,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios(axiosConfig);
      console.log({ response });
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Member added to Group sucessfully`,
          description: ``,
        });
        // router.push(`/my-organization/groups`);
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
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <div className="mb-6">
                  <h3 className="text-black dark:text-white mb-1 font-semibold text-lg">
                    Organization Members
                  </h3>
                  <FormDescription className="text-sm">
                    Select the members you want to add to the group
                  </FormDescription>
                </div>

                <div className="space-y-2"></div>

                {image.image.map((item: any) => (
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
                          <div className="flex items-center space-x-4">
                            <Checkbox
                              className="text-black dark:text-white"
                              checked={field.value?.includes(item.member.id)}
                              onCheckedChange={(checked: any) => {
                                console.log(checked, field);
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      item.member.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.member.id
                                      )
                                    );
                              }}
                            />
                            <div className="bg-muted text-black dark:text-white font-bold p-4 w-4 h-4 flex justify-center items-center uppercase  rounded-full">
                              {item.member.first_name[0]}
                            </div>

                            <div className="flex-1">
                              <div className="font-medium text-black dark:text-white ">
                                {`${item.member.first_name} ${item.member.last_name}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.member.email}
                              </div>
                            </div>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}

              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}

export default AddMembersModal;
