import React from "react";
import Tiers from "./tiers";

const Hero = () => {
  return (
    <div className="">
      <section className="lg:py-[80px] p-6  mt-[73px]">
        <div className="w-full lg:w-[588px] container mx-auto">
          <h1 className="lg:text-center text-left font-semibold lg:text-[48px] lg:py-0  pt-[32px]  text-[48px] leading-[120%] tracking-[-1px]">
            Tialabs pricing plans that fit your needs
          </h1>
          <p className="text-left lg:text-center mt-6 lg:text-[18px] text-base leading-[150%]">
            Our platform empowers learners with comprehensive online courses focused on Docker and various DevOps technologies, enabling them to enhance their skills in building, deploying, and managing software in a modern cloud infrastructure.
          </p>
        </div>
      </section>
      <Tiers />
    </div>
  );
};

export default Hero;
