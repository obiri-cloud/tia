"use client";
import { Label } from "../ui/neo-label";
import { Input } from "../ui/neo-input";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef } from "react";
import { LabelInputContainer } from "../ui/label-input-container";
import Link from "next/link";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import apiClient from "@/lib/request";

export function SignupFormDemo() {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { theme } = useTheme();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [typePassword, setTypePassword] = useState<boolean>(true);

  const formSchema = z
    .object({
      first_name: z.string().min(3, {
        message: "Name has to be 3 characters or more",
      }),
      last_name: z.string().min(3, {
        message: "Name has to be 3 characters or more",
      }),
      email: z.string().email({}),
      password1: z.string().min(6, {
        message: "Password has to be longer than 6 characaters",
      }),
      password2: z.string().min(6, {
        message: "Password has to be longer than 6 characaters",
      }),
      orgid: z.string().optional(),
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
      buttonRef.current.innerHTML = "Signning up... &rarr;";
    }
    let formData = {
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
      email: emailRef.current?.value,
      password1: passwordRef.current?.value,
      password2: confirmPasswordRef.current?.value,
      orgid: searchParams.get("orgid") ?? "",
    };

    try {
      formSchema.parse(formData);
      const response = await apiClient.post(
        `/auth/registration/`,
        JSON.stringify(formData)
      );

      if (response.data.status === 201) {
        router.push(`/signup/confirmation?email=${emailRef.current!.value}`);
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: response.data.message,
        });
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
          buttonRef.current.innerHTML = `Sign up &rarr;`;
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Sign up Error",
            description: err.message,
          })
        );
      } else if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          //@ts-ignore
          description: error.response.data.message,
        });
      }
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.innerHTML = "Sign up &rarr;";
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Tialabs
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Create an account and start learning
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              ref={firstNameRef}
              id="firstname"
              placeholder="John"
              type="text"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              ref={lastNameRef}
              id="lastname"
              placeholder="Doe"
              type="text"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            ref={emailRef}
            id="email"
            placeholder="example@example.com"
            type="email"
          />
        </LabelInputContainer>
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
            {typePassword ? (
              <EyeClosedIcon
                className={` ${
                  theme === "dark" ? "stroke-white" : "stroke-black"
                }   w-4 h-4`}
              />
            ) : (
              <EyeOpenIcon
                className={` ${
                  theme === "dark" ? "stroke-white" : "stroke-black"
                }   w-4 h-4`}
              />
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
            {typePassword ? (
              <EyeClosedIcon
                className={` ${
                  theme === "dark" ? "stroke-white" : "stroke-black"
                }   w-4 h-4`}
              />
            ) : (
              <EyeOpenIcon
                className={` ${
                  theme === "dark" ? "stroke-white" : "stroke-black"
                }   w-4 h-4`}
              />
            )}
          </span>
        </LabelInputContainer>

        <button
          ref={buttonRef}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Login
            </span>
            <BottomGradient />
          </Link>
          <Link
            href="/forgot-password"
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Forgot Password?
            </span>
            <BottomGradient />
          </Link>
        </div>
      </form>
    </div>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
