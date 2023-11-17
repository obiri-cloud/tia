import SignupForm from "@/components/Signup/SignupForm";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="md:text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] 
      text-[clamp(5rem,calc(2.73214rem_+_4.28571vw),7.875rem)]
      mb-8 leading-[110px] dec-text dark:text-white text-black md:tracking-[-10px] tracking-[-5px]  font-extrabold uppercase text-center">
        Sign Up
      </h1>
      <SignupForm />
      <Link href="/login" className="mt-6 font-medium dark:text-white text-black">
        Already have an account. Login
      </Link>
    </div>
  );
};

export default LoginPage;
