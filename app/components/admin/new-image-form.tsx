"use client";
import React, { FC, FormEvent, useEffect, useRef, useState } from "react";
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
import trash from "@/public/svgs/trash.svg";
import Image from "next/image";
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
  const commandRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imagePictureRef = useRef<HTMLInputElement>(null);
  const [updateImage, setUpdateImage] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(
    imageDetails?.difficulty_level ?? ""
  );
  const { data: session } = useSession();
  const dispatch = useDispatch();
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
    command: z.string().optional(),
    description: z.string().min(3, {
      message: "Description has to be 3 characters or more",
    }),
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }

    let parseFormData = {
      name: nameRef.current?.value,
      docker_image: dockerImageRef.current?.value,
      port_number: portNumberRef.current?.value,
      difficulty_level: difficultyLevel,
      duration: durationRef.current?.value,
      command: commandRef.current?.value,
      description: descriptionRef.current?.value,
    };

    const formData = new FormData();

    // Append fields to the FormData object
    formData.append("name", nameRef.current?.value || "");
    formData.append("docker_image", dockerImageRef.current?.value || "");
    formData.append("port_number", portNumberRef.current?.value || "");
    formData.append("difficulty_level", difficultyLevel);
    formData.append("duration", durationRef.current?.value || "");
    formData.append("description", descriptionRef.current?.value || "");
    formData.append("command", commandRef.current?.value || "");

    // Append the image file to the FormData object
    if (imagePictureRef.current && imagePictureRef.current!.files) {
      formData.append("image_picture", imagePictureRef.current!.files[0]);
    }

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/create/`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    };


    if (imageDetails) {
      axiosConfig.method = "PUT";
      axiosConfig.url = `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/${imageDetails.id}/update/`;
    }

    try {
      formSchema.parse(parseFormData);
      const response = await axios(axiosConfig);

      if (response.status === 201 || response.status === 200) {
        toast({
          variant: "success",
          title: "Image Creation Success",
          description: "Image created successfully",
        });
        getImageListX(token).then((response) => {
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
    setUpdateImage(false);
  };

  useEffect(() => {
    if (imageDetails?.difficulty_level) {
      setDifficultyLevel(imageDetails?.difficulty_level ?? "");
    }
  }, [imageDetails?.difficulty_level]);

  useEffect(() => {
    setUpdateImage(false);
  }, [imageDetails]);

  return (
    <DialogContent className="overflow-y-scroll h-[90vh] ">
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
                <FormLabel>Name <sup className="text-red-600">*</sup></FormLabel>
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
                  <FormLabel>Docker Image <sup className="text-red-600">*</sup></FormLabel>
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
                  <FormLabel>Port Number <sup className="text-red-600">*</sup></FormLabel>
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
                  <FormLabel>Duration <sup className="text-red-600">*</sup></FormLabel>
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
                <FormLabel>Difficulty Level <sup className="text-red-600">*</sup></FormLabel>
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

          <div className="my-6">
            <FormField
              control={form.control}
              name="image_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Picture</FormLabel>
                  <FormControl>
                    {imageDetails &&
                    imageDetails.image_picture &&
                    !updateImage ? (
                      <div className="flex justify-center">
                        <img src={imageDetails.image_picture} alt="Existing" />
                        <Button
                          variant={"destructive"}
                          onClick={() => setUpdateImage(true)}
                        >
                          <Image src={trash} alt="trash" className="w-[25px]" />
                        </Button>
                      </div>
                    ) : (
                      <Input
                        placeholder="Image Picture"
                        type="file"
                        {...field}
                        ref={imagePictureRef}
                        className="glassBorder"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="my-6">
            <FormField
              control={form.control}
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
                  <FormControl>
                    <Input
                      className="glassBorder"
                      {...field}
                      ref={commandRef}
                      defaultValue={imageDetails?.command}
                      placeholder="Command"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
