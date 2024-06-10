import React from "react";
import { Check, Circle, X } from "lucide-react";

const Tiers = ({ plan }: { plan: string }) => {
  const essentials = {
    title: "Basic Plan (Free)",
    text: "Sub-text description or not",
    price: "GHS 0",
    features: [
      {
        feature: "Absolutely Free (GHC 0.00)",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Access to some curated labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Lab Time Extension",
        icon: <X className="text-red-400 w-4 h-4" />,
        available: false,
      },
      {
        feature: "Organization management",
        icon: <X className="text-red-400 w-4 h-4" />,
        available: false,
      },
    ],
  };
  const premium = {
    title: "Plus",
    text: "Sub-text description or not",
    price: plan === "monthly" ? "GHC 149" : "GHC 1430",
    features: [
      {
        feature: "GHC 149/user/month or GHC 1430/yearly (at 20% off)",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Access to all Labs including specially curated Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Time Extension on Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Manage Unlimited Users in Organization",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Run 5 concurrent Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Proxy server for Labs to public internet",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Multi-Node Kubernetes Clusters",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Access to Sandbox environments",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Custom Labs environment upon request",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Business Support with dedicated Account Manager",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
    ],
  };

  const plus = {
    title: "Standard",
    text: "Sub-text description or not",
    price: plan === "monthly" ? "GHC 129" : "GHC 1230",
    features: [
      {
        feature: "GHC 129",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Access to all Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Time Extension on Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Manage Unlimited Users in Organization",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Run 2 concurrent Labs",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Proxy server for Labs to public internet",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
      {
        feature: "Single Node Kubernetes Clusters",
        icon: <Check className="text-green-400 w-4 h-4" />,
        available: true,
      },
    ],
  };

  return (
    <section className="lg:pb-[80px] p-6">
      <div className="container mx-auto lg:grid grid-cols-3 block items-end  gap-10 text-appBlack">
        {/* essentials */}
        <div className="p-8 bg-appGray rounded-2xl h-fit">
          <h3 className="text-[18px] font-semibold text-appBlack leading-[120%] mb-[10px] ">
            {essentials.title}
          </h3>
          {/* <p className="leading-150 mb-6">{essentials.text}</p> */}
          <p>
            <span className="text-[30px] font-semibold  tracking-[-0.33px] mr-[4px]">
              {essentials.price}
            </span>
            user/month
          </p>
          <ul className="mt-6 mb-[40px]">
            {essentials.features.map((ele, i) => (
              <li
                key={i}
                className={`mb-[8px] flex items-center leading-150 ${
                  ele.available ? "opacity-100" : "opacity-50"
                }`}
              >
                <span className="mr-[8px]">{ele.icon}</span>
                {ele.feature}
              </li>
            ))}
          </ul>
          <a
            href="/talk-to-us"
            className="bg-black text-center block w-full py-[12px] text-white rounded-full"
          >
            Talk to us
          </a>
        </div>

        {/* premium */}
        <div className=" bg-appGray rounded-2xl border-2 lg:my-0 my-6 border-appGold">
          <div className="bg-appGold py-[12px]  text-appBlack rounded-t-[14px]  text-center font-semibold ">
            RECOMMENDED
          </div>
          <div className="p-8 pt-[24px]">
            <h3 className="text-[18px] font-semibold text-appBlack leading-[120%] mb-[10px] ">
              {premium.title}
            </h3>
            {/* <p className="leading-150 mb-6">{premium.text}</p> */}
            <p>
              <span className="text-[30px] font-semibold  tracking-[-0.33px] mr-[4px]">
                {premium.price}
              </span>
              user/month
            </p>
            <ul className="mt-6 mb-[40px]">
              {premium.features.map((ele, i) => (
                <li
                  key={i}
                  className={`mb-[8px] flex items-center leading-150 ${
                    ele.available ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <span className="mr-[8px]">{ele.icon}</span>
                  {ele.feature}
                </li>
              ))}
            </ul>
            <a
              href="/talk-to-us"
              className="bg-black text-center block w-full py-[12px] text-white rounded-full"
            >
              Talk to us
            </a>
          </div>
        </div>

        {/* plus */}
        <div className="p-8 bg-appGray rounded-2xl h-fit">
          <h3 className="text-[18px] font-semibold text-appBlack leading-[120%] mb-[10px] ">
            {plus.title}
          </h3>
          {/* <p className="leading-150 mb-6">{plus.text}</p> */}
          <p>
            <span className="text-[30px] font-semibold  tracking-[-0.33px] mr-[4px]">
              {plus.price}
            </span>
            user/month
          </p>
          <ul className="mt-6 mb-[40px]">
            {plus.features.map((ele, i) => (
              <li
                key={i}
                className={`mb-[8px] flex items-center leading-150 ${
                  ele.available ? "opacity-100" : "opacity-50"
                }`}
              >
                <span className="mr-[8px]">{ele.icon}</span>
                {ele.feature}
              </li>
            ))}
          </ul>
          <a
            href="/talk-to-us"
            className="bg-black transition-all text-center block w-full py-[12px] text-white rounded-full"
          >
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Tiers;
