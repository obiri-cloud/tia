import React from "react";

const Footer = () => {
  const company = [
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
  ];

  const useCases = [
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
  ];

  const ecosystem = [
    {
      title: "lorem",
      link: "/",
    },
    {
      title: "lorem",
      link: "/",
    },
  ];
  return (
    <footer className="bg-appBlue pb-5 text-white">
      <div className="pb-[64px] container mx-auto">
        <div className="">
          <div className="lg:flex 2xl:gap-[160px] xl:gap-[80px] md:gap-[30px] block ">
            {/* <div className="">
              <h3 className="font-semibold text-[24px]">
                Sign up for updates on Tialabs
              </h3>
              <form>
                <div className="relative z-0 w-full mb-6 group mt-[32px]">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block py-2.5 px-0 w-full text-[20px] text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none  peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium absolute text-[20px] text-white  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    enter email
                  </label>
                  <button className="absolute top-[10px] right-[10px] leading-[120%] text-[20px] font-semibold">
                    submit
                  </button>
                </div>
              </form>
            </div> */}
            <div className="lg:grid grid-cols-3 lg:gap-[40px] gap-[20px] block w-full">
              <div className="">
                <h3 className="leading-[150%]  text-sm font-semibold mb-[22px]">
                  Company
                </h3>
                <ul>
                  {company.map((ele, i) => (
                    <li
                      key={i}
                      className="opacity-[0.72] leading-[150%] text-sm mb-[10px]"
                    >
                      <a href={ele.link}>{ele.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:mt-0 mt-[48px]">
                <h3 className="leading-[150%] text-center text-sm font-semibold mb-[22px]">
                  Use Cases
                </h3>
                <ul>
                  {useCases.map((ele, i) => (
                    <li
                      key={i}
                      className="opacity-[0.72] text-center leading-[150%] text-sm mb-[10px]"
                    >
                      <a href={ele.link}>{ele.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:mt-0 mt-[48px]">
                <h3 className="leading-[150%] text-center text-sm font-semibold mb-[22px]">
                  Ecosystem
                </h3>
                <ul>
                  {ecosystem.map((ele, i) => (
                    <li
                      key={i}
                      className="opacity-[0.72] leading-[150%] text-sm mb-[10px] text-center"
                    >
                      <a href={ele.link}>{ele.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
