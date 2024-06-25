"use client";
import ReduxProvider from "@/redux/ReduxProvider";
import { Inter } from "next/font/google";
import { signOut, useSession } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { usePathname, useRouter } from "next/navigation";
import {
  GalleryVerticalEndIcon,
  LogOut,
  PanelLeft,
  PieChart,
  TicketIcon,
  User,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import OrganizationHeader from "../components/admin/OrganizationHeader";
import useAuthorization from "@/hooks/useAuthorization";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { logout } from "@/lib/logout";

const inter = Inter({ subsets: ["latin"] });

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedInfo, setSelectedInfo] = useState({
    label: "",
    description: "",
  });

  const links = [
    {
      label: "Overview",
      link: "/my-organization/overview",
      icon: PieChart,
      description: "This page shows all the labs in your organizations.",
    },
    {
      label: "Labs",
      link: "/my-organization",
      icon: PanelLeft,
      description: "This page shows all the labs in your organizations.",
    },
    {
      label: "Groups",
      link: "/my-organization/groups",
      icon: GalleryVerticalEndIcon,
      description: "This page shows all the groups in your organizations.",
    },
    {
      label: "Members",
      link: "/my-organization/members",
      icon: Users,
      description: "This page shows all the members in your organizations.",
    },
    {
      label: "Invitation",
      link: "/my-organization/invitation",
      icon: TicketIcon,
      description: "This page shows all the invitations in your organizations.",
    },
    {
      label: "Organization Account",
      link: "/my-organization/account",
      icon: User,
      position: "bottom",
      description:
        "This page shows the organization account in your organizations.",
    },
  ];

  let { isAuthorized, allowedLinks } = useAuthorization();

  const errorMessage = "You don't have access to this page.";

  if (!isAuthorized && !session?.user.data.organization_id) {
    toast({
      title: errorMessage,
      variant: "destructive",
      duration: 3000,
    });

    if (allowedLinks) {
      router.push(allowedLinks[0].link);
    } else {
      router.push("/dashboard");
    }
  }

  if (session?.user.data.organization_id) {
    allowedLinks = links;
  }

  return (
    <ReduxProvider>
      <Sheet>
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
                <OrganizationHeader />

                <div className="flex flex-1 flex-col">
                  <ul className="space-y-2 font-medium mt-[50px] flex-1">
                    {allowedLinks &&
                      allowedLinks
                        .filter((link) => link.position !== "bottom")
                        .map((item) => {
                          let Icon = item.icon;
                          return (
                            <li className="all-images-button">
                              <div
                                className={`flex items-center justify-between p-2 rounded-lg group   dark:hover:bg-menuHov hover:bg-menuHovWhite ${
                                  pathname === item.link
                                    ? "bg-menuHovWhite dark:bg-menuHov"
                                    : ""
                                }`}
                              >
                                <Link
                                  href={item.link}
                                  className={`flex items-center justify-between rounded-lg dark:text-white`}
                                >
                                  <Icon className="w-5 h-5" />
                                  <span className={`ms-3 font-light`}>
                                    {item.label}
                                  </span>
                                </Link>
                                <SheetTrigger
                                  onClick={() =>
                                    setSelectedInfo({
                                      label: item.label,
                                      description: item.description,
                                    })
                                  }
                                  asChild
                                >
                                  <button className="text-blue-700 text-xs">
                                    info
                                  </button>
                                </SheetTrigger>
                              </div>
                            </li>
                          );
                        })}
                  </ul>
                  <div className="">
                    <ul className="space-y-2 font-medium">
                      {allowedLinks &&
                        allowedLinks
                          .filter((link) => link.position == "bottom")
                          .map((item) => {
                            let Icon = item.icon;
                            return (
                              <li className="all-images-button">
                                <Link
                                  href={item.link}
                                  className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                                    pathname === item.link
                                      ? "bg-menuHovWhite dark:bg-menuHov"
                                      : ""
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                  <span className={`ms-3  font-light`}>
                                    {item.label}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                      <li className="logout-button">
                        <span
                          onClick={logout}
                          className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group cursor-pointer"
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
          ) : null}

          <SheetContent>
            <SheetHeader>
              <SheetTitle>{selectedInfo.label}</SheetTitle>
              <SheetDescription>{selectedInfo.description}</SheetDescription>
            </SheetHeader>
          </SheetContent>

          <div
            className={`${
              !pathname.startsWith("/dashboard/labs") ? "sm:ml-[220px]" : ""
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
      </Sheet>
    </ReduxProvider>
  );
}
