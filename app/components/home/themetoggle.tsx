"use client";
import { useTheme } from "next-themes";
import React from "react";
import sun from "@/public/svgs/sun.svg";
import moon from "@/public/svgs/moon.svg";
import Image from "next/image";

const ThemeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className={` bottom-10 right-10 glassBorder p-5 rounded-full z-[100] ${
        theme == "dark" ? "bg-white" : "bg-black"
      } fixed`}
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme === "dark" ? (
        <Image alt="moon" src={moon} className="w-[20px] h-[20px]" />
      ) : (
        <Image alt="sun" src={sun} className="w-[20px] h-[20px]" />
      )}
    </button>
  );
};

export default ThemeToggle;
