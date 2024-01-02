"use client";

import React, { useRef, FormEvent, useState } from "react";
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

const SignupConfirmationForm = () => {
  const form = useForm();
  const codeRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();




  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const formSchema = z.object({
    code: z
      .string()
      .min(5, {
        message: "Code has to be 5 characters or more",
      })
      .max(6, {
        message: "Code can't to be more than 5 characters ",
      }),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true;
      buttonRef.current.textContent = "Confirming";
    }

    let formData = {
      code: codeRef.current?.value,
      email,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/registration/confirm/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        router.push(`/login?email=${email}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("error.issues", error.issues);

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
      buttonRef.current.textContent = "Confirm";

      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="container max-w-[500px] w-full">
        <FormField
          control={form.control}
          name="Code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirmation Number"
                  type="number"
                  {...field}
                  ref={codeRef}
                  className="glassBorder text-black"

                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          ref={buttonRef}
          className="w-full mt-6 disabled:bg-black-900/10 bg-pink-200 text-white "
          variant="black"
        >
          Confirm
        </Button>
      </form>
    </Form>
  );
};

export default SignupConfirmationForm;
