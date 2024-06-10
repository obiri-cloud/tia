"use client";
import React, { useState } from "react";
import Tiers from "./tiers";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Hero = () => {
  const [plan, setPlan] = useState<string>("monthly");

  return (
    <div className="">
      <section className="lg:py-[80px] p-6  mt-[73px]">
        <div className="w-full lg:w-[588px] container mx-auto">
          <h1 className="lg:text-center text-left font-semibold lg:text-[48px] lg:py-0  pt-[32px]  text-[48px] leading-[120%] tracking-[-1px]">
            Tialabs pricing plans that fit your needs
          </h1>
          <p className="text-left lg:text-center mt-6 lg:text-[18px] text-base leading-[150%]">
            Our platform empowers learners with comprehensive online courses
            focused on Docker and various DevOps technologies, enabling them to
            enhance their skills in building, deploying, and managing software
            in a modern cloud infrastructure.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="mt-8 bg-white shadow-md inline-flex rounded-full text-sm p-1 gap-2 cursor-pointer transition duration-300 ease-in-out">
            <div
              onClick={() => setPlan("monthly")}
              className={`
              rounded-full text-black px-3 py-1 transition duration-300 ease-in-out
              ${plan === "monthly" ? "bg-black text-white" : "bg-white"}
              `}
            >
              Monthly
            </div>
            <div
              onClick={() => setPlan("yearly")}
              className={`
              rounded-full text-black px-2 py-1 transition duration-300 ease-in-out
              ${plan === "yearly" ? "bg-black text-white" : "bg-white"}
              `}
            >
              Yearly
            </div>
          </div>
        </div>
      </section>
      <Tiers plan={plan} />
    </div>
  );
};

export default Hero;
