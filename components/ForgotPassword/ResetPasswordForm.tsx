"use client";

import React, { useRef, FormEvent } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ResetPasswordForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  const formSchema = z
    .object({
      code: z
        .string()
        .min(5, {
          message: "Code has to be 5 characters or more",
        })
        .max(6, {
          message: "Code can't to be more than 5 characters ",
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
    }

    let formData = {
      code,
      password1: passwordRef.current?.value,
      password2: confirmPasswordRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}auth/password/change/`,
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("error.issues", error.issues);

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
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="max-w-[500px] w-full">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="my-6">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="my-6">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={confirmPasswordRef}
                    type="password"
                    placeholder="Confirm Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          ref={buttonRef}
          className="w-full mt-6 disabled:bg-black-900/10"
          variant="black"
        >
          Reset
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
