import Fullscreen from "@/app/components/home/fullscreen";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import secureLocalStorage from "react-secure-storage";
const Navbar = () => {
  const logout = () => {
    signOut({ callbackUrl: "/login" });
    secureLocalStorage.removeItem("tialabs_info");
  };
  return (
    <nav className="w-full bg-black p-3 text-white glassBorder border-t-0 border-r-0">
      <ul className="flex  gap-4 justify-end">
        <li>
          <Link href="/dashboard" className="hover:bg-black/10">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/dashboard/explore" className="hover:bg-black/10">
            Explore
          </Link>{" "}
        </li>
        <li>
          <Link href="/dashboard/account" className="hover:bg-black/10">
            Account
          </Link>{" "}
        </li>
        <li>
          <button onClick={() => logout()} className="hover:bg-black/10">
            Logout
          </button>
        </li>
        <Fullscreen/>
      </ul>
    </nav>
  );
};

export default Navbar;
