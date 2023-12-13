"use client";
import React from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

const SignupForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

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
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
      email: emailRef.current?.value,
      password1: passwordRef.current?.value,
      password2: confirmPasswordRef.current?.value,
    };

    try {
      formSchema.parse(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/registration/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("response.data", response.data);

      if (response.data.status === 201) {
        router.push(`/signup/confirmation?email=${emailRef.current!.value}`);
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: response.data.message,
        });
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
    } finally {
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="max-w-[500px] container w-full dark:text-white text-black"
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    type="text"
                    {...field}
                    className="glassBorder"
                    ref={firstNameRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    type="text"
                    {...field}
                    className="glassBorder"
                    ref={lastNameRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  className="glassBorder"
                  ref={emailRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={passwordRef}
                    type="password"
                    className="glassBorder"
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
              <FormItem className="">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={confirmPasswordRef}
                    type="password"
                    className="glassBorder"
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
          className="w-full disabled:bg-black-900/10 dark:bg-white dark:text-black bg-black text-white "
          variant="black"
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
