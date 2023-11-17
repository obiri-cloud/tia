import ForgotPasswordForm from '@/components/ForgotPassword/ForgotPasswordForm';
import React from 'react'

const ForgotPassword = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="md:text-[clamp(6rem,calc(2.73214rem_+_4.28571vw),7.875rem)] 
      text-[clamp(5rem,calc(2.73214rem_+_4.28571vw),7.875rem)]
      mb-8 leading-[110px] dec-text dark:text-white text-black md:tracking-[-10px] tracking-[-5px]  font-extrabold uppercase text-center">
            Forget
          </h1>
          <ForgotPasswordForm />
        </div>
      );
}

export default ForgotPassword