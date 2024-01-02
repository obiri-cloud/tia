import SignupForm from "@/components/Signup/SignupForm";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <main className="Layout_content__PrPCk">

    <div className="flex flex-col justify-center items-center h-screen cJPsz">
      <h1 className="cmVMmT bzZmGu">Sign Up</h1>
     
      <SignupForm />
      <Link href="/login" className="mt-6 font-medium text-[#AFB3B8] underline underline-offset-4">
      Already have an account. Login

      </Link>
    </div>
    </main>
  );
};

export default LoginPage;
