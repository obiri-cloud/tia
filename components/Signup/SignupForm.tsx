"use client";
import React, { useState } from "react";
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
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const SignupForm = () => {
  const form = useForm();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

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

      if (response.data.status === 201) {
        toast({
          variant: "success",
          title: "Registration succesful. Check your inbox.",
        });
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
                <FormLabel className=" formTextLight">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    type="text"
                    {...field}
                    className="glassBorder text-white bg-black/10"
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
                <FormLabel className=" formTextLight">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    type="text"
                    {...field}
                    className="glassBorder text-white bg-black/10"
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
              <FormLabel className=" formTextLight">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  {...field}
                  className="glassBorder text-white bg-black/10"
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
                <FormLabel className=" formTextLight">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      ref={passwordRef}
                      type={typePassword? "password": "text"}

                      className="glassBorder text-white bg-black/10 pr-7"

                      placeholder="Password"
                    />
                    <span
                      onClick={() => setTypePassword(!typePassword)}
                      className="absolute top-[50%] right-0 translate-x-[-50%]  translate-y-[-50%]  cursor-pointer p-1"
                    >
                      {!typePassword ? <EyeClosedIcon className="stroke-white"/> : <EyeOpenIcon  className="stroke-white"/>}
                    </span>
                  </div>
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
                <FormLabel className=" formTextLight">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      ref={confirmPasswordRef}
                      type={typePassword? "password": "text"}

                      className="glassBorder text-white bg-black/10 pr-7"
                      placeholder="Confirm Password"
                    />
                    <span
                      onClick={() => setTypePassword(!typePassword)}
                      className="absolute top-[50%] right-0 translate-x-[-50%]  translate-y-[-50%]  cursor-pointer p-1"
                    >
                      {!typePassword ? <EyeClosedIcon className="stroke-white" /> : <EyeOpenIcon className="stroke-white"/>}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          ref={buttonRef}
          className="w-full disabled:bg-black-900/10 bg-pink-200 text-white "
          variant="black"
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
