"use client";
import React, { FormEvent, useRef, useState } from "react";
import {
  Form,
  FormControl,
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
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastAction } from "../ui/toast";
import { useSession } from "next-auth/react";

const LoginForm = () => {
  const form = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const email = searchParams.get("email");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [logging, setLogging] = useState(false);

  const formSchema = z.object({
    email: z.string().email({}),
    password: z.string().min(6, {
      message: "Password has to be longer than 6 characaters",
    }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLogging(true);

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
            console.log("session", session)
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
          setLogging(false);
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
              <FormLabel className=" formTextLight">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  defaultValue={email ?? ""}
                  {...field}
                  ref={emailRef}
                  className="glassBorder text-white bg-black/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="my-6">
              <FormLabel className=" formTextLight">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className="glassBorder text-white bg-black/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={logging}
          ref={buttonRef}
          className="w-full disabled:bg-black-900/10 bg-pink-200 text-white "
          variant="black"
        >
          {logging ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
