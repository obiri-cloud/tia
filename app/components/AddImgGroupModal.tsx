
"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"; 


const FormSchema = z.object({
  image: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})


 
 function CheckboxReactHookFormMultiple(image:any) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  console.log( typeof image);

  

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: [],
    },
  })


    
  const { data: session } = useSession();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
 

 async function onSubmit(data:z.infer<typeof FormSchema>){
  let image_ids = { image_ids: data.image }


    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/group/${image.gid}/image/add/`,
      data:image_ids,
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data"
        Authorization: `Bearer ${token}`,
      }
    };
    try {
      const response = await axios(axiosConfig);
      console.log({response});
      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: `Image added to Group sucessfully`,
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




 
  return (
    <DialogContent className="flex justify-center items-center overflow-y-scroll h-[60vh] ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Organization Members</FormLabel>
                  <FormDescription>
                    Select the members you want to add to the group
                  </FormDescription>
                </div>
                {Array.isArray(image?.image) && image.image.length  > 0 ? (
                  image.image.map((item: any) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={form.getValues("image")?.includes(item.member.id)}
                          onCheckedChange={(checked: boolean) => {
                            const newValue = checked
                              ? [...form.getValues("image"), item.member.id]
                              : form.getValues("image")?.filter((value: number) => value !== item.member.id);
                            form.setValue("image", newValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {item.member.email}
                      </FormLabel>
                    </FormItem>
                  ))
                ) : (
                  <div>No members available</div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  )
}

export default CheckboxReactHookFormMultiple