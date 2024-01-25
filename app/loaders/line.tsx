"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function LineLoader() {
  const { theme } = useTheme();

  useEffect(() => {
    async function getLoader() {
      const { lineWobble } = await import("ldrs");
      lineWobble.register();
    }
    getLoader();
  }, []);
  return (
    <l-line-wobble
      size="1000"
      stroke="1"
      bg-opacity="0.1"
      speed="1.75"
      color={`${theme === "light" ? "black" : "white"}`}
    ></l-line-wobble>
  );
}
