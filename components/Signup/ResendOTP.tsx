"use client";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import apiClient from "@/lib/request";

const ResendOTP = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const router = useRouter();

  let formData = {
    email,
  };

  const resendCode = async () => {
    toast({
      title: "Sending OTP to your email",
    });
    try {
      const response = await apiClient.post(
        `/auth/registration/resend-otp/`,
        JSON.stringify(formData)
      );
      if (response.data.status === 201) {
        toast({
          title: "Vefication code sent to mail",
          variant: "success",
          duration: 2000,
        });
      } else {
        console.log("response.data", response.data);

        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          //@ts-ignore
          title: error.response.data.message,
          variant: "info",
          duration: 2000,
        });
        //@ts-ignore
        if (error.response.data.message.includes("already verified")) {
          router.push(`/login?email=${email}`);
        }
      }
    }
  };
  return (
    <span
      onClick={resendCode}
      className="font-medium text-black dark:text-white"
    >
      Resend OTP code
    </span>
  );
};

export default ResendOTP;
