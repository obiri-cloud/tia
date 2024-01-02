import ResendOTP from "@/components/Signup/ResendOTP";
import SignupConfirmationForm from "@/components/Signup/SignupConfirmationForm";
import axios from "axios";
import React from "react";

const SignUpConfirmation = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen cJPsz">
      <h1 className="cmVMmT bzZmGu">
        Confirm Sign up
      </h1>
      <SignupConfirmationForm />
      <ResendOTP />
    </div>
  );
};

export default SignUpConfirmation;
