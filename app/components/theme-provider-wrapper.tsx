"use client";

import { ThemeProvider } from "next-themes";
export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  console.log("NEXT_PUBLIC_BE_URL", process.env.NEXT_PUBLIC_BE_URL);
  console.log("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET);
  console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);
  
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
