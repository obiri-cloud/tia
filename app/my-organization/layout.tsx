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

const inter = Inter({ subsets: ["latin"] });

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = () => {
    signOut({ callbackUrl: "/login" });
    secureLocalStorage.removeItem("tialabs_info");
  };

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const links = [
    {
      label: "Labs",
      link: "/my-organization",
      icon: PanelLeft,
    },
    {
      label: "Groups",
      link: "/my-organization/groups",
      icon: GalleryVerticalEndIcon,
    },
    {
      label: "Members",
      link: "/my-organization/members",
      icon: Users,
    },
    {
      label: "Invitation",
      link: "/my-organization/invitation",
      icon: TicketIcon,
    },
  ];

  let { isAuthorized, allowedLinks } = useAuthorization();
  console.log("auth", session?.user.data.organization_id);
  console.log("isAuthorized", isAuthorized);

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
                    allowedLinks.map((item) => {
                      let Icon = item.icon;
                      return (
                        <li className="all-images-button">
                          <a
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
                          </a>
                        </li>
                      );
                    })}
                </ul>
                <div className="">
                  <ul className="space-y-2 font-medium">
                    <li className="account-button">
                      <a
                        href="/my-organization/account"
                        className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                          pathname === "/my-organization/account"
                            ? "bg-menuHovWhite dark:bg-menuHov"
                            : ""
                        }`}
                      >
                        <User
                          className={`
                          w-5 h-5
                          ${
                            pathname === "/my-organization/account"
                              ? "bg-menuHovWhite dark:bg-menuHov"
                              : " "
                          }
                          `}
                        />
                        <span
                          className={`
                        ms-3 
                        ${
                          pathname === "/my-organization/account"
                            ? "font-semibold"
                            : "font-light "
                        }
                        `}
                        >
                          Organization Account
                        </span>
                      </a>
                    </li>
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
      <script src="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.js"></script>
    </ReduxProvider>
  );
}
