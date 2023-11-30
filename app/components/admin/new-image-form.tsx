"use client";
import React, {
  FC,
  FormEvent,
  RefObject,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { useSession } from "next-auth/react";
import { getImageListX } from "./overview";
import { setImageCount, setImageList } from "@/redux/reducers/adminSlice";
import { useDispatch } from "react-redux";

interface INewImageForm {
  imageDetails: ILabImage | null;
}
const NewImageForm: FC<INewImageForm> = ({ imageDetails }) => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const levels = ["beginner", "intermediate", "hard"];

  const nameRef = useRef<HTMLInputElement>(null);
  const dockerImageRef = useRef<HTMLInputElement>(null);
  const portNumberRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const prerequisitesRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [difficultyLevel, setDifficultyLevel] = useState(
    imageDetails?.difficulty_level ?? ""
  );
  const { data: session } = useSession();
  const dispatch = useDispatch()
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const formSchema = z.object({
    name: z.string().min(3, {
      message: "Name has to be 3 characters or more",
    }),
    docker_image: z.string().min(3, {
      message: "Docker image has to be 3 characters or more",
    }),
    port_number: z.coerce
      .number()
      .int()
      .gte(0, { message: "Port number has to be greater than 0" }),
    difficulty_level: z.string().min(1, {
      message: "Select a difficulty level",
    }),
    duration: z.coerce.number().int().optional(),
    // prerequisites: z.string().optional(),
    description: z.string().min(3, {
      message: "Description has to be 3 characters or more",
    }),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    let formData = {
      name: nameRef.current?.value,
      docker_image: dockerImageRef.current?.value,
      port_number: portNumberRef.current?.value,
      difficulty_level: difficultyLevel,
      duration: durationRef.current?.value,
      // prerequisites: prerequisitesRef.current?.value ?? "",
      description: descriptionRef.current?.value,
    };

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/create/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(formData),
    };
    if (imageDetails) {
      axiosConfig.method = "PUT";
      axiosConfig.url = `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${imageDetails.id}/update/`;
    }

    try {
      formSchema.parse(formData);
      const response = await axios(axiosConfig);

      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: "Image Creation Success",
          description: "Image created successfully",
        });
        getImageListX(token).then((response)=> {
          dispatch(setImageCount(response.data.count));
          dispatch(setImageList(response.data.results));
          document.getElementById("closeDialog")?.click();
        });
      } else {
        toast({
          variant: "destructive",
          title: "Image Creation  Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("error", error);

      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Image Creation Error",
            description: err.message,
          })
        );
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  useEffect(() => {
    setDifficultyLevel(imageDetails?.difficulty_level ?? "");
  }, []);

  return (
    <DialogContent className="overflow-y-scroll">
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] container w-full dark:text-white text-black"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    type="text"
                    {...field}
                    className="glassBorder"
                    ref={nameRef}
                    defaultValue={imageDetails?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-6">
            <FormField
              control={form.control}
              name="docker_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Docker Image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Docker Image"
                      type="text"
                      {...field}
                      className="glassBorder"
                      ref={dockerImageRef}
                      defaultValue={imageDetails?.docker_image}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
            <FormField
              control={form.control}
              name="port_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Port Number"
                      type="number"
                      {...field}
                      className="glassBorder"
                      ref={portNumberRef}
                      defaultValue={imageDetails?.port_number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      placeholder="Duration"
                      type="number"
                      {...field}
                      className="glassBorder"
                      ref={durationRef}
                      defaultValue={imageDetails?.duration}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(dl) => setDifficultyLevel(dl)}
                    {...field}
                    defaultValue={imageDetails?.difficulty_level}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((dl, i) => (
                        <SelectItem
                          //   onClick={() => console.log(dl)}
                          className="capitalize"
                          key={i}
                          value={dl}
                        >
                          {dl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="my-6">
            {" "}
            <FormField
              control={form.control}
              name="prerequisites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prerequisites"
                      type="text"
                      {...field}
                      ref={prerequisitesRef}
                      defaultValue={imageDetails?.prerequisites}
                      className="glassBorder"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <div className="my-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="glassBorder"
                      {...field}
                      ref={descriptionRef}
                      defaultValue={imageDetails?.description}
                      placeholder="Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            ref={buttonRef}
            className="w-full disabled:bg-black-900/10 mt-6 dark:bg-white dark:text-black bg-black text-white "
            variant="black"
          >
            {imageDetails ? "Update" : "Save"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewImageForm;
