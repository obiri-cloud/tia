"use client";

import React, { useRef, FormEvent } from "react";

import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { LabelInputContainer } from "../ui/label-input-container";
import { Input } from "../ui/neo-input";
import { Label } from "../ui/neo-label";
import { BottomGradient } from "../Signup/SForm";
import apiClient from "@/lib/request";

const ForgotPasswordForm = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    email: z.string().email({}),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      buttonRef.current.innerHTML = "Submitting... &rarr;";
    }
    let email = emailRef.current?.value;

    let formData = {
      email,
    };

    try {
      formSchema.parse(formData);
      const response = await apiClient.post(
        `/auth/password/forgot-password/`,
        JSON.stringify(formData)
      );

      toast({
        title: response.data.message,
        variant: "success",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "An error occured when sending the reset code.",
            description: err.message,
          })
        );
      }
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "An error occured when sending the reset code.",
          description: error?.response?.data.message,
        });
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.innerHTML = "Submit... &rarr;";
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Forgot Password?
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Reset your password
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            ref={emailRef}
            id="email"
            placeholder="example@example.com"
            type="email"
          />
        </LabelInputContainer>

        <button
          ref={buttonRef}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          Submit &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
