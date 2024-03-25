"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function InfinityLoader() {
  const { systemTheme, theme, setTheme } = useTheme();

  useEffect(() => {
    async function getLoader() {
      const { infinity } = await import("ldrs");
      infinity.register();
    }
    getLoader();
  }, []);
  return (
    <l-infinity
      size="30"
      stroke="4"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="1.2"
      color={`${theme === "light" ? "white" : "black"}`}
    ></l-infinity>
  );
}

