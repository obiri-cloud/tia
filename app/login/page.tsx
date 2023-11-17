import React from "react";
import Link from "next/link";
import LoginForm from "@/components/Login/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen container">
      <h1 className="md:text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] 
      text-[clamp(5rem,calc(2.73214rem_+_4.28571vw),7.875rem)]
      mb-8 leading-[110px] dec-text dark:text-white text-black md:tracking-[-10px] tracking-[-5px]  font-extrabold uppercase text-center">
        Login
      </h1>
      <LoginForm />
      <Link href="/signup" className="mt-6 font-medium">
        Don't have any account? Sign up
      </Link>
      <Link href="/forgot-password" className="mt-6 font-medium">
        Forgot Password?
      </Link>
    </div>
  );
};

export default LoginPage;
