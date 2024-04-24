
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
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react";
 
const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] 
 
const FormSchema = z.object({
  image: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})


 
 function CheckboxReactHookFormMultiple(image:any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: [],
    },
  })
  
 
  function onSubmit(data:z.infer<typeof FormSchema>) {
    let image_ids=data
     console.log(image_ids);
 
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }




 
  return (
    <DialogContent
      className="flex justify-center items-center overflow-y-scroll h-[60vh] "
    >
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Organization Images</FormLabel>
                <FormDescription>
                  Select the Images you want to add to the group
                </FormDescription>
              </div>
              {image.image.map((item:any) => (
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
                        <FormControl>
                          <Checkbox
                        
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked:any) => {
                              console.log(checked,field);
                              return checked
                                ? field.onChange([...field.value,item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
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