"use client";
import React, { FormEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastAction } from "../ui/toast";
import { useSession } from "next-auth/react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { BottomGradient } from "../Signup/SForm";
import { EyeIcon, EyeOff } from "lucide-react";
import { LabelInputContainer } from "../ui/label-input-container";
import { Label } from "../ui/neo-label";
import Link from "next/link";
import { Input } from "../ui/neo-input";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const email = searchParams.get("email");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [typePassword, setTypePassword] = useState<boolean>(true);

  const formSchema = z.object({
    email: z.string().email({}),
    password: z.string().min(6, {
      message: "Password has to be longer than 6 characaters",
    }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      buttonRef.current.textContent = "Logging in...";
    }

    try {
      let email = emailRef.current?.value;
      let password = passwordRef.current?.value;

      formSchema.parse({
        email,
        password,
      });
      signIn("credentials", {
        email,
        password,
        redirect: false,
      })
        .then((res) => {
          if (res?.error === null) {
            toast({
              title: "Login Successful",
              variant: "success",
            });
            // @ts-ignore
            let status = session?.user.data.is_admin as boolean;

            if (status) {
              router.push("/admin");
            } else {
              router.push("/dashboard");
            }
          } else {
            toast({
              title: "Login Failed",
              description:
                "Please enter the correct email and password. Note that both fields may be case-sensitive.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
              variant: "destructive",
            });
          }
        })
        .finally(() => {
          if (buttonRef.current) {
            buttonRef.current.disabled = false;
            buttonRef.current.textContent = "Login";
          }
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.map((err) =>
          toast({
            variant: "destructive",
            title: "Login Error",
            description: err.message,
          })
        );
      }

      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.textContent = "Login";
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Log in to Tialabs
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Continue learning on Tialabs
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

        <button
          ref={buttonRef}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 cursor-pointer"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Link
            href="/signup"
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            Don't have any account? Sign up
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
};

export default LoginForm;
