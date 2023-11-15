import React from "react";

const Stats = () => {
  const stats = [
    {
      number: "20+",
      title: "Lorem ipsum",
    },
    {
      number: "100+",
      title: "Lorem ipsum",
    },
    {
      number: "200+",
      title: "Lorem ipsum",
    },
  ];
  return (
    <div className="container py-[100px]">
      <h3 className=" uppercase mb-10 font-bold text-center text-2xl">
        Trusted by institutions and enterprises{" "}
      </h3>
      <div className="lg:grid grid-cols-3 gap-6 block">
        {stats.map((stat, i) => (
          <div key={i} className="">
            <div className="">
              <div className="w-[56px] h-[8px] bg-appYellow mb-[8px]"></div>
              <p
                className={`text-left tracking-[-1px] leading-[120%] text-[38px] font-semibold `}
              >
                {stat.number}
              </p>
              <p className="">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
