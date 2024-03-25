import ResendOTP from "@/components/Signup/ResendOTP";
import SConfirmationForm from "@/components/Signup/SConfirmationForm";
import SignupConfirmationForm from "@/components/Signup/SignupConfirmationForm";
import axios from "axios";
import React from "react";

const SignUpConfirmation = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen cJPsz">
      <SConfirmationForm />
    </div>
  );
};

export default SignUpConfirmation;
