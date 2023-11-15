"use client";

import { ThemeProvider } from "next-themes";
export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
