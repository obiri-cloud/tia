"use client";
import AdminCheck from "../../hooks/admin-check";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { SVGProps } from "react";
import ProfileHeader from "../components/admin/profile-header";
import { useDispatch } from "react-redux";
import ReduxProvider from "@/redux/ReduxProvider";
import {
  GalleryHorizontal,
  LogOut,
  PieChart,
  Scroll,
  Star,
  Users,
} from "lucide-react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useAdminCheck from "../../hooks/admin-check";
import { toast } from "@/components/ui/use-toast";
const inter = Inter({ subsets: ["latin"] });

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = () => {
    signOut({ callbackUrl: "/login" });
    secureLocalStorage.removeItem("tialabs_info");
  };

  const pathname = usePathname();

  const isAdmin = useAdminCheck();

  const router = useRouter();

  if (!isAdmin) {
    toast({
      variant: "destructive",
      title: "Protected Page",
      description: "You are being redirected here because you are not an admin",
    });
    router.push("/dashboard");
  }

  return (
    <ReduxProvider>
      <div
        className={`text-sm font-light dark:text-dashboardText dark:bg-[#191a23] bg-white text-whiteDark  h-screen ${inter.className}`}
      >
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <aside
          id="default-sidebar"
          className="fixed top-0 left-0 z-40 w-[220px] h-screen transition-transform -translate-x-full sm:translate-x-0 border-r dark:border-r-[#2c2d3c] border-r-whiteEdge dark:text-dashboardText dark:bg-[#191a23] bg-white text-whiteDark"
        >
          <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
            <ProfileHeader />
            <div className="flex flex-1 flex-col">
              <ul className="space-y-2 font-medium mt-[50px] flex-1">
                <li>
                  <a
                    href="/admin"
                    className={`
                  flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group

                  ${
                    pathname === "/admin"
                      ? "bg-menuHovWhite dark:bg-menuHov"
                      : ""
                  }
                  `}
                  >
                    <PieChart
                      className={`
                  ${
                    pathname === "/admin"
                      ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white"
                      : ""
                  }
                  `}
                    />
                    <span className="ms-3 font-light">Overview</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/images"
                    className={`
                    ${
                      pathname === "/admin/images"
                        ? "bg-menuHovWhite dark:bg-menuHov"
                        : ""
                    }
                    flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group
                    `}
                  >
                    <GalleryHorizontal className="w-5 h-5  transition duration-75 dark:group-hover:text-white fill-white dark:fill-white" />
                    <span className="ms-3 font-light">Images</span>
                  </a>
                </li>

                <li>
                  <a
                    href="/admin/labs"
                    className={`
                    ${
                      pathname === "/admin/labs"
                        ? "bg-menuHovWhite dark:bg-menuHov"
                        : ""
                    }
                    flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group
                    `}
                  >
                    <Scroll
                      className={`
                  ${
                    pathname === "/admin/"
                      ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white"
                      : ""
                  }
                  `}
                    />
                    <span className="ms-3 font-light">Labs</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/reviews"
                    className={`
                    ${
                      pathname === "/admin/reviews"
                        ? "bg-menuHovWhite dark:bg-menuHov"
                        : ""
                    }
                    flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group
                    `}
                  >
                    <Star className="w-5 h-5  text-black transition duration-75 dark:group-hover:text-white  dark:stroke-white" />
                    <span className="ms-3 font-light">Reviews</span>
                  </a>
                </li>
              </ul>
              <div className="">
                <ul className="space-y-2 font-medium">
                  <li>
                    <span
                      onClick={logout}
                      className={`
                      flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group cursor-pointer
                      `}
                    >
                      <LogOut className="w-5 h-5  transition duration-75 dark:group-hover:text-white fill-white dark:fill-whiteDark" />
                      <span className="ms-3 font-light">Logout</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div className="sm:ml-[220px] overflow-y-auto h-screen">{children}</div>
      </div>
    </ReduxProvider>
  );
}
