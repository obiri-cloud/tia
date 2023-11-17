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
    <footer className="bg-appBlue relative top-[-1px] pb-5 text-white">
      <div className="pb-[64px] container mx-auto">
        <div className="">
          <div className="flex justify-center pt-4">
            <form>
              <h3 className="font-semibold text-2xl text-center">
                Sign up for updates on Tialabs
              </h3>
              <div className="relative z-0 max-w-[400px] w-full mb-6 group mt-[32px]">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
