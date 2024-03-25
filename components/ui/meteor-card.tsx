import React from "react";
import { Meteors } from "../ui/meteors";

export function MeteorsCard({ title, text }: { title: string; text: string }) {
  
  return (
    <div className="">
      <div className=" w-full relative ">
        <div className="absolute inset-0 h-full w-full  transform scale-[0.80] rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-[0_0%_98%] border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
          </div>

          <h1 className="font-bold text-xl text-neutral-200 mb-4 relative z-50">
            {title}
          </h1>

          <p className="font-normal text-base text-neutral-400 mb-4 relative z-50">
            {text}
          </p>

          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
