import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="glassBorder">
      <div className="h-screen container flex flex-col justify-center items-center dark:text-white text-black ">
        <div className="w-full flex flex-col justify-center px-8">
          <h1 className="text-[clamp(5rem,calc(2.73214rem_+_3.28571vw),2.875rem)] dark:text-white text-black text-center w-full mb-8 leading-[110px] tracking-[-2px]  font-extrabold uppercase ">
            {/* Master Programming Through{" "} */}
            <span className="dec-text">Hands-On</span> Labs
          </h1>
          <p className=" text-center dark:text-white text-black">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
            repellat earum cumque minus ad? Voluptate magni, soluta voluptatum
            impedit alias laboriosam exercitationem illo nulla aliquid mollitia
            esse, ratione explicabo. Eveniet!
          </p>
        </div>
        <div className="flex gap-4 ">
          <Link
            href="/signup"
            className="px-[50px] mt-6 w-fit bg-black glassBorder text-white hover:bg-black/90 rounded-md text-sm font-medium h-10 py-2"
          >
            Get Started
          </Link>
          <Link
            href="/labs"
            className="px-[50px] mt-6 w-fit glassBorder bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium h-10 py-2 dark:bg-white bg-black dark:text-black text-white "
          >
            Explore Labs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
