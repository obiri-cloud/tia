import Image from "next/image";
import React from "react";
import fast from "@/public/svgs/fast.svg";

const Provisioning = () => {
  const providers = [
    {
      name: "Azure",
      icon: (
        <Image
          alt=""
          width={100}
          height={100}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
        />
      ),
    },
    {
      name: "Google Cloud",
      icon: (
        <Image
          alt=""
          width={100}
          height={100}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
        />
      ),
    },
    {
      name: "AWS",
      icon: (
        <i className="devicon-amazonwebservices-original colored text-[100px]"></i>
      ),
    },
    {
      name: "Digital Ocean",
      icon: <i className="devicon-digitalocean-plain colored text-[100px]"></i>,
    },
  ];
  return (
   <section className="dark:bg-[#06000f] bg-white py-5">
     <div className="container pt-6 ">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div className="p-5 noise-bg bg-[#AA6000] text-white rounded-lg shadow-sm">
          <h3 className="font-bold text-2xl lg:mb-6 mb-2">Zero Cost Cloud Labs</h3>
          <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum nesciunt sint optio consequatur dolor reiciendis repellendus</p>
        </div>
        <div className="noise-bg p-5 bg-[#4B0082] rounded-lg shadow-sm text-white relative">
          <h3 className="font-bold text-2xl lg:mb-6 mb-2">Fast Labs</h3>
          <p className="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Earum nesciunt sint 
            optio consequatur dolor reiciendis
            repellendus
          </p>
        </div>
      </div>
      <div className="noise-bg p-5 bg-blue-700 rounded-lg shadow-sm mt-4 lg:flex block justify-between  items-center text-white">
        <div className="">
          <h3 className="font-bold text-2xl lg:mb-6 mb-2">
            Choose from one of our many providers
          </h3>
          <p className="font-normal text-sm">
            Lorem ipsum, dolor sit amet consectetur <br className="lg:block hidden" /> adipisicing elit.
            Earum nesciunt sint <br className="lg:block hidden" /> 
            optio consequatur dolor reiciendis <br className="lg:block hidden" /> 
            repellendus, a
          </p>
        </div>
        <div className="md:flex justify-between grid grid-cols-2 flex-wrap gap-8 lg:mt-0 mt-6">
          {providers.map((pd, i) => (
            <div className="" key={i}>
              {pd.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
   </section>
  );
};

export default Provisioning;
