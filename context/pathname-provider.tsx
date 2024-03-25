"use client";

import { usePathname } from "next/navigation";

export default function PathnameProvider(): React.ReactNode {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/login" && !pathname.match("/signup")  && !pathname.match("/forgot-password") &&  pathname !== "/"  ? null : null}
      {/* <ThemeToggle /> */}

    </>
  );
}
