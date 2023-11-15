"use client";

import ThemeToggle from "@/app/components/home/themetoggle";
import Navbar from "@/components/ui/navbar";
import { usePathname } from "next/navigation";

export default function PathnameProvider(): React.ReactNode {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/login" && !pathname.match("/signup")  && !pathname.match("/forgot-password") &&  pathname !== "/"  ? <Navbar /> : null}
      <ThemeToggle />

    </>
  );
}
