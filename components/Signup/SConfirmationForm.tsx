"use client";

import React, { useRef, FormEvent, useState } from "react";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Label } from "../ui/neo-label";
import { LabelInputContainer } from "../ui/label-input-container";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BottomGradient } from "./SForm";
import ResendOTP from "./ResendOTP";
import apiClient from "@/lib/request";

const SConfirmationForm = () => {
  const codeRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const formSchema = z.object({
    code: z
      .string()
      .min(5, {
        message: "Code has to be 5 characters",
      })
      .max(6, {
        message: "Code can't to be more than 5 characters ",
      }),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      buttonRef.current.innerHTML = "Confirming... &rarr;";
    }

    let formData = {
      code: codeRef.current?.value,
      email,
    };

    try {
      formSchema.parse(formData);
      const response = await apiClient.post(
        `/auth/registration/confirm/`,
        JSON.stringify(formData)
      );

      toast({
        variant: "success",
        title: "Confirmation succesful. You can login now.",
      });
      if (response.data.status === 200) {
        router.push(`/login?email=${email}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.issues);

        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Confirmation Error",
            description: err.message,
          })
        );
      }
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Confirmation Error",
          description: error?.response?.data.message,
        });
      }
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.innerHTML = "Confirm &rarr;";
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Confirmation Code
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Check your email for the confirmation code
      </p>

      <form onSubmit={handleSubmit} className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Code</Label>
          <InputOTP ref={codeRef} className="text-black" maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        </LabelInputContainer>

        <button
          ref={buttonRef}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          Confirm &rarr;
          <BottomGradient />
        </button>
      </form>
      <div className="flex flex-col space-y-4 ">
        <button
          className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
        >
          <ResendOTP />

          <BottomGradient />
        </button>
      </div>
    </div>
  );
};

export default SConfirmationForm;
