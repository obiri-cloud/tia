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

const ForgotPasswordForm = () => {
  const form = useForm();
  const codeRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({}),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    let email = emailRef.current?.value;

    let formData = {
      email,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/password/forgot-password/`,
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
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="max-w-[500px] w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  {...field}
                  ref={emailRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          ref={buttonRef}
          className="w-full  mt-6  disabled:bg-black-900/10 dark:bg-white dark:text-black bg-black text-white "
          variant="black"
        >
          Send
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
