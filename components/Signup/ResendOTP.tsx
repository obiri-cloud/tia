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
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/send-otp/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        toast({
          title: "Vefication code sent to mail",
          variant: "success",
        });
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive",
      });
    }
  };
  return (
    <button onClick={resendCode} className="mt-6 font-medium">
      Resend OTP code
    </button>
  );
};

export default ResendOTP;
