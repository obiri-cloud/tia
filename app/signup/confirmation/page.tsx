import ResendOTP from "@/components/Signup/ResendOTP";
import SignupConfirmationForm from "@/components/Signup/SignupConfirmationForm";
import axios from "axios";
import React from "react";

const SignUpConfirmation = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] mb-8 leading-[110px] dec-text dark:text-white text-black  tracking-[-10px]  font-extrabold uppercase text-center">
        Confirm
      </h1>
      <SignupConfirmationForm />
      <ResendOTP />
    </div>
  );
};

export default SignUpConfirmation;
