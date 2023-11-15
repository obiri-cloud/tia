import ResetPasswordForm from "@/components/ForgotPassword/ResetPasswordForm";
import React from "react";

const NewPassword = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] mb-8 leading-[110px] dec-text text-black tracking-[-10px]  font-extrabold uppercase text-center">
        Reset
      </h1>
      <ResetPasswordForm />
    </div>
  );
};

export default NewPassword;
