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
import {
  setCurrentImage,
  setImageCount,
  setImageList,
} from "@/redux/reducers/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import trash from "@/public/svgs/trash.svg";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ContentProps, ILabImage } from "@/app/types";
import { Trash } from "lucide-react";

const NewImageForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const levels = ["beginner", "intermediate", "hard"];

  const imageDetails: ILabImage | null = useSelector(
    (state: RootState) => state.admin.currentImage
  );

  const dispatch = useDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const dockerImageRef = useRef<HTMLInputElement>(null);
  const portNumberRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLInputElement>(null);
  const argumentsRef = useRef<HTMLInputElement>(null);

  const [
    readinessProbeInitialDelaySeconds,
    setReadinessProbeInitialDelaySeconds,
  ] = useState<number | null>(
    imageDetails?.readiness_probe_initial_delay_seconds ?? null
  );
  const [readinessProbePeriodSeconds, setReadinessProbePeriodSeconds] =
    useState<number | null>(
      imageDetails?.readiness_probe_period_seconds ?? null
    );
  const [readinessProbeTimeoutSeconds, setReadinessProbeTimeoutSeconds] =
    useState<number | null>(
      imageDetails?.readiness_probe_timeout_seconds ?? null
    );
  const [readinessProbeSuccessThreshold, setReadinessProbeSuccessThreshold] =
    useState<number | null>(
      imageDetails?.readiness_probe_success_threshold ?? null
    );
  const [readinessProbeFailureThreshold, setReadinessProbeFailureThreshold] =
    useState<number | null>(
      imageDetails?.readiness_probe_failure_threshold ?? null
    );
  const [
    livenessProbeInitialDelaySeconds,
    setLivenessProbeInitialDelaySeconds,
  ] = useState<number | null>(
    imageDetails?.liveness_probe_initial_delay_seconds ?? null
  );
  const [livenessProbePeriodSeconds, setLivenessProbePeriodSeconds] = useState<
    number | null
  >(imageDetails?.liveness_probe_period_seconds ?? null);
  const [livenessProbeTimeoutSeconds, setLivenessProbeTimeoutSeconds] =
    useState<number | null>(
      imageDetails?.liveness_probe_timeout_seconds ?? null
    );
  const [livenessProbeSuccessThreshold, setLivenessProbeSuccessThreshold] =
    useState<number | null>(
      imageDetails?.liveness_probe_success_threshold ?? null
    );
  const [livenessProbeFailureThreshold, setLivenessProbeFailureThreshold] =
    useState<number | null>(
      imageDetails?.liveness_probe_failure_threshold ?? null
    );

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imagePictureRef = useRef<HTMLInputElement>(null);
  const [updateImage, setUpdateImage] = useState(false);
  const [sideCar, setSideCar] = useState(imageDetails?.sidecar);
  const [difficultyLevel, setDifficultyLevel] = useState(
    imageDetails?.difficulty_level ?? ""
  );
  const { data: session } = useSession();
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
    arguments: z.string().optional(),

    readiness_probe_initial_delay_seconds: z.string().optional(),
    readiness_probe_period_seconds: z.string().optional(),
    readiness_probe_timeout_seconds: z.string().optional(),
    readiness_probe_success_threshold: z.string().optional(),
    readiness_probe_failure_threshold: z.string().optional(),
    liveness_probe_initial_delay_seconds: z.string().optional(),
    liveness_probe_period_seconds: z.string().optional(),
    liveness_probe_timeout_seconds: z.string().optional(),

    liveness_probe_success_threshold: z.string().optional(),
    liveness_probe_failure_threshold: z.string().optional(),

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
      arguments: argumentsRef.current?.value,
      description: descriptionRef.current?.value,
      sidecar: sideCar,
    };

    let df: any = {
      name: nameRef.current?.value || "",
      docker_image: dockerImageRef.current?.value || "",
      port_number: portNumberRef.current?.value || "",
      difficulty_level: difficultyLevel,
      duration: durationRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      command: commandRef.current?.value || "",
      arguments: argumentsRef.current?.value || "",
      sidecar: sideCar,
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
    formData.append("arguments", argumentsRef.current?.value || "");

    // if (imageDetails) {
    if (!readinessProbeInitialDelaySeconds) {
      df["readiness_probe_initial_delay_seconds"] =
        String(readinessProbeInitialDelaySeconds) || "";
      formData.append(
        "readiness_probe_initial_delay_seconds",
        String(readinessProbeInitialDelaySeconds) || ""
      );
    }

    if (!readinessProbeTimeoutSeconds) {
      df["readiness_probe_period_seconds"] =
        String(readinessProbeTimeoutSeconds) || "";

      formData.append(
        "readiness_probe_period_seconds",
        String(readinessProbeTimeoutSeconds) || ""
      );
    }

    if (!readinessProbeSuccessThreshold) {
      df["readiness_probe_timeout_seconds"] =
        String(readinessProbeSuccessThreshold) || "";

      formData.append(
        "readiness_probe_timeout_seconds",
        String(readinessProbeSuccessThreshold) || ""
      );
    }

    if (!readinessProbeFailureThreshold) {
      df["readiness_probe_success_threshold"] =
        String(readinessProbeFailureThreshold) || "";

      formData.append(
        "readiness_probe_success_threshold",
        String(readinessProbeFailureThreshold) || ""
      );
    }

    if (!readinessProbeFailureThreshold) {
      df["readiness_probe_failure_threshold"] =
        String(readinessProbeFailureThreshold) || "";

      formData.append(
        "readiness_probe_failure_threshold",
        String(readinessProbeFailureThreshold) || ""
      );
    }

    if (!livenessProbeInitialDelaySeconds) {
      df["liveness_probe_initial_delay_seconds"] =
        String(livenessProbeInitialDelaySeconds) || "";

      formData.append(
        "liveness_probe_initial_delay_seconds",
        String(livenessProbeInitialDelaySeconds) || ""
      );
    }

    if (!livenessProbePeriodSeconds) {
      df["liveness_probe_period_seconds"] =
        String(livenessProbePeriodSeconds) || "";

      formData.append(
        "liveness_probe_period_seconds",
        String(livenessProbePeriodSeconds) || ""
      );
    }
    if (!livenessProbeTimeoutSeconds) {
      df["liveness_probe_timeout_seconds"] =
        String(livenessProbeTimeoutSeconds) || "";

      formData.append(
        "liveness_probe_timeout_seconds",
        String(livenessProbeTimeoutSeconds) || ""
      );
    }

    if (!livenessProbeSuccessThreshold) {
      df["liveness_probe_success_threshold"] =
        String(livenessProbeSuccessThreshold) || "";

      formData.append(
        "liveness_probe_success_threshold",
        String(livenessProbeSuccessThreshold) || ""
      );
    }

    if (!livenessProbeFailureThreshold) {
      df["liveness_probe_failure_threshold"] =
        String(livenessProbeFailureThreshold) || "";

      formData.append(
        "liveness_probe_failure_threshold",
        String(livenessProbeFailureThreshold) || ""
      );
    }
    // }

    df = removeNullFields(df);

    // Append the image file to the FormData object
    if (imagePictureRef.current && imagePictureRef.current!.files) {
      formData.append("image_picture", imagePictureRef.current!.files[0]);
    }

    let axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/moderator/image/create/`,
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      data: df,
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
          title: `Image ${imageDetails ? "Update" : "Creation"} Success`,
          description: `Image ${
            imageDetails ? "updated" : "created"
          } successfully`,
        });
        getImageListX(token).then((response) => {
          dispatch(setImageCount(response.data.count));
          dispatch(setImageList(response.data.data));
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
      console.error("error", error);

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

  function removeNullFields(obj: any) {
    for (const key in obj) {
      if (obj[key] === "null") {
        delete obj[key];
      }
    }
    return obj;
  }

  useEffect(() => {
    if (imageDetails?.difficulty_level) {
      setDifficultyLevel(imageDetails?.difficulty_level ?? "");
    }
  }, [imageDetails?.difficulty_level]);

  useEffect(() => {
    setUpdateImage(false);
  }, [imageDetails]);

  useEffect(() => {
    setReadinessProbeInitialDelaySeconds(
      imageDetails?.readiness_probe_initial_delay_seconds ?? null
    );
    setReadinessProbePeriodSeconds(
      imageDetails?.readiness_probe_period_seconds ?? null
    );
    setReadinessProbeTimeoutSeconds(
      imageDetails?.readiness_probe_timeout_seconds ?? null
    );
    setReadinessProbeSuccessThreshold(
      imageDetails?.readiness_probe_success_threshold ?? null
    );
    setReadinessProbeFailureThreshold(
      imageDetails?.readiness_probe_failure_threshold ?? null
    );
    setLivenessProbeInitialDelaySeconds(
      imageDetails?.liveness_probe_initial_delay_seconds ?? null
    );

    setLivenessProbePeriodSeconds(
      imageDetails?.liveness_probe_period_seconds ?? null
    );
    setLivenessProbeTimeoutSeconds(
      imageDetails?.liveness_probe_timeout_seconds ?? null
    );
    setLivenessProbeSuccessThreshold(
      imageDetails?.liveness_probe_success_threshold ?? null
    );
    setLivenessProbeFailureThreshold(
      imageDetails?.liveness_probe_failure_threshold ?? null
    );
    setSideCar(imageDetails?.sidecar);
  }, [imageDetails]);

  const renderProbeSettings = (imageDetails: ILabImage | null) => (
    <>
      <p className="text-sm text-gray-600 mb-6 font-bold text-center">
        Probe Settings
      </p>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
        <FormField
          control={form.control}
          name="readiness_probe_initial_delay_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Readiness Probe Initial Delay Seconds{" "}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Readiness Probe Initial Delay Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setReadinessProbeInitialDelaySeconds(Number(e.target.value))
                  }
                  value={readinessProbeInitialDelaySeconds ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readiness_probe_period_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Readiness Probe Period Seconds
              </FormLabel>
              <FormControl>
                <Input
                  min={1}
                  placeholder="Readiness Probe Period Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setReadinessProbePeriodSeconds(Number(e.target.value))
                  }
                  value={readinessProbePeriodSeconds ?? ""}
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
          name="readiness_probe_timeout_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Readiness Probe Timeout Seconds
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Readiness Probe Timeout Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setReadinessProbeTimeoutSeconds(Number(e.target.value))
                  }
                  value={readinessProbeTimeoutSeconds ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="readiness_probe_success_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Readiness Probe Success Threshold
              </FormLabel>
              <FormControl>
                <Input
                  min={1}
                  placeholder="Readiness Probe Success Threshold"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setReadinessProbeSuccessThreshold(Number(e.target.value))
                  }
                  value={readinessProbeSuccessThreshold ?? ""}
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
          name="readiness_probe_failure_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Readiness Probe Failure Threshold
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Readiness Probe Failure Threshold"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setReadinessProbeFailureThreshold(Number(e.target.value))
                  }
                  value={readinessProbeFailureThreshold ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="liveness_probe_initial_delay_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Liveness Probe Initial Delay Seconds
              </FormLabel>
              <FormControl>
                <Input
                  min={1}
                  placeholder="Liveness Probe Initial Delay Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setLivenessProbeInitialDelaySeconds(Number(e.target.value))
                  }
                  value={livenessProbeInitialDelaySeconds ?? ""}
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
          name="liveness_probe_period_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Liveness Probe Period Seconds
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Liveness Probe Period Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setLivenessProbePeriodSeconds(Number(e.target.value))
                  }
                  value={livenessProbePeriodSeconds ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="liveness_probe_timeout_seconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Liveness Probe Timeout Seconds
              </FormLabel>
              <FormControl>
                <Input
                  min={1}
                  placeholder="Liveness Probe Timeout Seconds"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setLivenessProbeTimeoutSeconds(Number(e.target.value))
                  }
                  value={livenessProbeTimeoutSeconds ?? ""}
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
          name="liveness_probe_success_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Liveness Probe Success Threshold
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Liveness Probe Success Threshold"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setLivenessProbeSuccessThreshold(Number(e.target.value))
                  }
                  value={livenessProbeSuccessThreshold ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="liveness_probe_failure_threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" formTextLight">
                Liveness Probe Failure Threshold
              </FormLabel>
              <FormControl>
                <Input
                  min={1}
                  placeholder="Liveness Probe Failure Threshold"
                  type="number"
                  {...field}
                  className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                  onChange={(e) =>
                    setLivenessProbeFailureThreshold(Number(e.target.value))
                  }
                  value={livenessProbeFailureThreshold ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const handleOnEsc = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      dispatch(setCurrentImage(null));
    }
  };

  const handleOnClickOutside = (e: ContentProps["onPointerDownOutside"]) => {
    dispatch(setCurrentImage(null));
  };

  return (
    <DialogContent
      onEsc={(e) => handleOnEsc(e)}
      onClickOutside={(e) => handleOnClickOutside(e)}
      className="overflow-y-scroll h-[90vh] "
    >
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
                <FormLabel className=" formTextLight">
                  Name <sup className="text-red-500">*</sup>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    type="text"
                    {...field}
                    className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
                  <FormLabel className=" formTextLight">
                    Docker Image <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Docker Image"
                      type="text"
                      {...field}
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
                  <FormLabel className=" formTextLight">
                    Port Number <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Port Number"
                      type="number"
                      {...field}
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
                  <FormLabel className=" formTextLight">
                    Duration <sup className="text-red-500">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      min={1}
                      placeholder="Duration"
                      type="number"
                      {...field}
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
                <FormLabel className=" formTextLight">
                  Difficulty Level <sup className="text-red-500">*</sup>
                </FormLabel>
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
                        <SelectItem className="capitalize" key={i} value={dl}>
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
                  <FormLabel className=" formTextLight">
                    Image Picture
                  </FormLabel>
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
                          <Trash className="w-[25px]" />
                        </Button>
                      </div>
                    ) : (
                      <Input
                        placeholder="Image Picture"
                        type="file"
                        {...field}
                        ref={imagePictureRef}
                        className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
                  <FormLabel className=" formTextLight">Command</FormLabel>
                  <FormControl>
                    <Input
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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
              name="arguments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" formTextLight">Arguments</FormLabel>
                  <FormControl>
                    <Input
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
                      {...field}
                      ref={argumentsRef}
                      defaultValue={imageDetails?.arguments}
                      placeholder="Arguments"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="my-6 flex items-center space-x-2">
            <Switch
              checked={sideCar}
              onCheckedChange={(e) => setSideCar(e)}
              id="side-car"
            />
            <Label htmlFor="side-car">Side car</Label>
          </div>

          <div className="my-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" formTextLight">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="glassBorder dark:text-white dark:bg-black/10 bg-white text-black"
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

          {renderProbeSettings(imageDetails)}

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
