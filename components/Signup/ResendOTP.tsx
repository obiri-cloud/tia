"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "../ui/toast";

const ResendOTP = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  let formData = {
    email,
  };

  const resendCode = async () => {
    toast({
      title: "Sending OTP to your email",
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/registration/resend-otp/`,
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
          title: "Vefication code sent to mail",
          variant: "success",
          duration: 2000,
        });
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
        duration: 2000,
      });
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
