"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function SquareLoader() {
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    async function getLoader() {
      const { square } = await import("ldrs");
      square.register();
    }
    getLoader();
  }, []);
  return (
    <l-square
      size="30"
      stroke="1"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="1.2"
      color={`${theme === "light" ? "black" : "white"}`}
    ></l-square>
  );
}
