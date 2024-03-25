"use client";

import React, { useRef, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { LabelInputContainer } from "../ui/label-input-container";
import { Label } from "../ui/neo-label";
import { BottomGradient } from "../Signup/SForm";
import { EyeIcon, EyeOff } from "lucide-react";
import { Input } from "../ui/neo-input";

const ResetPasswordForm = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [typePassword, setTypePassword] = useState<boolean>(true);

  const router = useRouter();

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  console.log("code", code);
  
  const email = searchParams.get("email");

  const formSchema = z
    .object({
      code: z
        .string()
        .min(5, {
          message: "Code has to be 5 characters or more",
        })
        .max(6, {
          message: "Code can't to be more than 6 characters ",
        }),
      password1: z.string().min(6, {
        message: "Password has to be longer than 6 characaters",
      }),
      password2: z.string().min(6, {
        message: "Password has to be longer than 6 characaters",
      }),
    })
    .superRefine(({ password1, password2 }, ctx) => {
      if (password1 !== password2) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords don't match",
        });
      }
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      buttonRef.current.innerHTML = "Resetting... &rarr;";
    }

    let formData = {
      code,
      password1: passwordRef.current?.value,
      password2: confirmPasswordRef.current?.value,
      email,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/password/confirm/forgot-password/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      toast({
        title: response.data.message,
        variant: "success",
      });
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.innerHTML = "Reset &rarr;";
      }
      router.push(`/login?email=${email}`);
    } catch (error) {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.innerHTML = "Reset &rarr;";
      }
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Password Reset Error",
            description: err.message,
          })
        );
      }
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Password Reset Error",
          description: error?.response?.data.message,
        });
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Reset Password
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Confirm to reset your password
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            ref={passwordRef}
            id="password"
            placeholder="••••••••"
            type={typePassword ? "password" : "text"}
          />
          <span
            onClick={() => setTypePassword(!typePassword)}
            className="absolute top-[55%] right-0 translate-x-[-50%]  translate-y-[-55%]  cursor-pointer p-1"
          >
            {!typePassword ? (
              <EyeIcon className="stroke-black fill-transparent w-4 h-4" />
            ) : (
              <EyeOff className="stroke-black fill-transparent w-4 h-4" />
            )}
          </span>
        </LabelInputContainer>
        <LabelInputContainer className="mb-8 relative">
          <Label htmlFor="twitterpassword">Confirm password</Label>
          <Input
            ref={confirmPasswordRef}
            id="confirmPassword"
            placeholder="••••••••"
            type={typePassword ? "password" : "text"}
          />
          <span
            onClick={() => setTypePassword(!typePassword)}
            className="absolute top-[55%] right-0 translate-x-[-50%]  translate-y-[-55%]  cursor-pointer p-1"
          >
            {!typePassword ? (
              <EyeIcon className="stroke-black fill-transparent w-4 h-4" />
            ) : (
              <EyeOff className="stroke-black fill-transparent w-4 h-4" />
            )}
          </span>
        </LabelInputContainer>

        <button
          ref={buttonRef}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          Reset &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
