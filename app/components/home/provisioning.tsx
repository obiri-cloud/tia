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
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 noise-bg bg-[#AA6000] glassBorder text-white rounded-lg shadow-sm">
          <h3 className="font-bold text-2xl mb-6">Zero Cost Cloud Labs</h3>
          <p className="text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum nesciunt sint optio consequatur dolor reiciendis repellendus</p>
        </div>
        <div className="noise-bg p-5 bg-[#4B0082] rounded-lg shadow-sm text-white relative">
          <h3 className="font-bold text-2xl mb-6">Fast Labs</h3>
          <p className="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Earum nesciunt sint 
            optio consequatur dolor reiciendis
            repellendus
          </p>
        </div>
      </div>
      <div className="noise-bg py-10 px-5 bg-blue-700 rounded-lg shadow-sm mt-4 flex justify-between  items-center text-white">
        <div className="">
          <h3 className="font-bold text-2xl mb-6">
            Choose from one of our many providers
          </h3>
          <p className="font-normal">
            Lorem ipsum, dolor sit amet consectetur <br /> adipisicing elit.
            Earum nesciunt sint <br />
            optio consequatur dolor reiciendis <br />
            repellendus, a
          </p>
        </div>
        <div className="flex gap-8">
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
