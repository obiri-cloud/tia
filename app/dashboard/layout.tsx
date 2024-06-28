"use client";
import ReduxProvider from "@/redux/ReduxProvider";

import { Inter } from "next/font/google";

import { usePathname } from "next/navigation";
import { DropToggle } from "../components/DropToggle";
import {
  LayoutDashboard,
  ListVideo,
  LogOut,
  Play,
  ShapesIcon,
  User,
  UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/logout";
import { isActive } from "@/lib/isPathActive";

const inter = Inter({ subsets: ["latin"] });

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const topMenu = [
    {
      name: "Labs",
      Icon: LayoutDashboard,
      href: "/dashboard",
      isExact: true,
    },
    {
      name: "Active Labs",
      Icon: ListVideo,
      href: "/dashboard/active-labs",
      isExact: true,
    },
  ];

  const bottomMenu = [
    {
      name: "Account",
      Icon: UserIcon,
      href: "/dashboard/account",
      isExact: true,
      onClick: () => {},
    },
    {
      name: "Logout",
      Icon: LogOut,
      href: "#",
      isExact: true,
      onClick: () => {
        logout();
      },
    },
  ];
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

        {!pathname.startsWith("/dashboard/labs") ? (
          <aside
            id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-[220px] h-screen transition-transform -translate-x-full sm:translate-x-0 border-r dark:border-r-[#2c2d3c] border-r-whiteEdge dark:text-dashboardText dark:bg-[#191a23] bg-white text-whiteDark"
          >
            <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
              <h1 className="pl-2 text-lg font-medium tracking-tighter text-center">
                Tialabs
              </h1>
              <div className="flex flex-1 flex-col">
                <ul className="space-y-2 font-medium mt-[50px] flex-1">
                  {topMenu.map((menu) => (
                    <Link
                      href={menu.href}
                      key={menu.name}
                      className={cn(
                        isActive(menu.href, pathname, menu.isExact)
                          ? "bg-gray-200 text-gray-800 active:bg-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:active:bg-gray-700"
                          : "text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:active:bg-gray-700",
                        "flex w-full items-center space-x-2 rounded-lg p-2 text-sm font-medium"
                      )}
                    >
                      {menu.Icon && (
                        <menu.Icon className="w-4 h-4 mr-2 shrink-0" />
                      )}
                      {menu.name}
                    </Link>
                  ))}
                </ul>
                <div className="">
                  <ul className="space-y-2 font-medium">
                    {bottomMenu.map((menu) => (
                      <Link
                        href={menu.href}
                        key={menu.name}
                        className={cn(
                          isActive(menu.href, pathname, menu.isExact)
                            ? "bg-gray-200 text-gray-800 active:bg-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:active:bg-gray-700"
                            : "text-gray-500 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:active:bg-gray-700",
                          "flex w-full items-center space-x-2 rounded-lg p-2 text-sm font-medium"
                        )}
                        onClick={menu.onClick}
                      >
                        {menu.Icon && (
                          <menu.Icon className="w-4 h-4 mr-2 shrink-0" />
                        )}
                        {menu.name}
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        ) : null}

        <div
          className={`${
            !pathname.startsWith("/dashboard/labs")
              ? "sm:ml-[220px]"
              : "overflow-y-hidden"
          } overflow-y-auto h-screen`}
        >
          {children}
        </div>
      </div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      ></link>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
    </ReduxProvider>
  );
}
