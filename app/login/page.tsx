import React from "react";
import Link from "next/link";
import LoginForm from "@/components/Login/LoginForm";

const LoginPage = () => {
  return (
    <main className="Layout_content__PrPCk">

    <div className="flex flex-col justify-center items-center h-screen container cJPsz">
      <h1 className="cmVMmT bzZmGu">Login</h1>
      <LoginForm />
      <Link href="/signup" className="mt-6 font-medium text-[#AFB3B8] underline underline-offset-4">
        Don't have any account? Sign up
      </Link>
      <Link href="/forgot-password" className="mt-6 font-medium text-[#AFB3B8] underline underline-offset-4">
        Forgot Password?
      </Link>
    </div>
    </main>
  );
};

export default LoginPage;
