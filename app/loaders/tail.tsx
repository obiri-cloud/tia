"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function TailLoader() {
  const { theme } = useTheme();

  useEffect(() => {
    async function getLoader() {
      const { tailspin } = await import("ldrs");
      tailspin.register();
    }
    getLoader();
  }, []);
  return (
    <l-tailspin
      size="25"
      stroke="1"
      speed="0.9"
      color={`${theme === "light" ? "black" : "white"}`}
    ></l-tailspin>
  );
}
