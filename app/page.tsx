"use client";
import React from "react";
import { MacbookScrollDemo } from "@/components/ui/mac-scroll-demo";
import { Meteors } from "@/components/ui/meteors";
import { MeteorsCard } from "@/components/ui/meteor-card";
import { StickyScrollRevealPreview } from "@/components/ui/sticky-scroll-preview";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { LearnDevops } from "@/components/ui/learn-devops";
import { Navbar } from "@/components/ui/navbar";
import { SpotlightPreview } from "./components/home/spotlight-preview";
import Codes from "./components/home/codes";
import Footer from "./components/home/footer";

const page = () => {
  const features = [
    {
      title: "<=30 seconds spin-up time",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "60 minutes labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "2 free labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "10+ labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "4+ cloud providers supported",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
  ];
  return (
    <div className="bg-black/[0.96]">
      <Navbar />
      <SpotlightPreview />
      <div className="container">
        <h2 className="text-[22px] font-normal text-center text-neutral-300">
          Choose from our multiple cloud providers.
        </h2>
        <div className="flex gap-[100px] justify-center">
          <div className="">
            <i className="devicon-azure-plain-wordmark text-[150px] text-neutral-300"></i>
          </div>
          <div className="">
            <i className="devicon-googlecloud-plain-wordmark text-[150px] text-neutral-300"></i>
          </div>
          <div className="">
            <i className="devicon-amazonwebservices-plain-wordmark text-[150px] text-neutral-300"></i>
          </div>
          <div className="">
            <i className="devicon-digitalocean-plain-wordmark text-[130px] text-neutral-300"></i>
          </div>
        </div>
      </div>

      <section className="keyfeatures container">
        <h3
          style={{
            maxWidth: "650px",
            margin: "auto",
            marginBottom: "40px",
          }}
          className="sc-734624b2-0 sc-6bdb0090-1 dytDgx dMeTup mb-5 jykcho"
        >
          Tialabs dominates the market competition with its unmatched features,
          setting a new standard for excellence.
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {features.map((feat, i) => (
            <MeteorsCard {...feat} />
          ))}
        </div>
      </section>

      <Codes />
      <LearnDevops />
      <Footer />
    </div>
  );
};

export default page;
