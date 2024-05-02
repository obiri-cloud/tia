"use client";
import ReduxProvider from "@/redux/ReduxProvider";
import { SVGProps } from "react";
import { Inter } from "next/font/google";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import ProfileHeader from "../components/admin/profile-header";
import { usePathname } from "next/navigation";
import { DropToggle } from "../components/DropToggle";
import { LogOut, Play, ShapesIcon, User } from "lucide-react";
import OrganizationHeader from "../components/admin/OrganizationHeader";


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
  const [organizationName, setOrganizationName] = useState();
  const pathname = usePathname();



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
                  <li className="all-images-button">
                    <a
                      href="/my-organization"
                      className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                        pathname.startsWith("/my-organization") &&
                        pathname !== "/dashboard/active-labs" &&
                        pathname !== "/dashboard/account"
                          ? "bg-menuHovWhite dark:bg-menuHov"
                          : ""
                      }`}
                    >
                      <ShapesIcon
                        className={`


${
  pathname.startsWith("/dashboard") &&
  pathname !== "/dashboard/active-labs" &&
  pathname !== "/dashboard/account"
    ? "w-5 h-5  transition duration-75 dark:group-hover:text-white fill-white dark:fill-whiteDark stroke-2"
    : ""
}


`}
                      />
                      <span
                        className={`ms-3 
                      
                      ${
                        pathname.startsWith(
                          "/my-organization/organizationImages"
                        ) &&
                        pathname !== "/dashboard/active-labs" &&
                        pathname !== "/dashboard/account"
                          ? "bg-menuHovWhite dark:bg-menuHov font-semibold"
                          : "font-light"
                      }
                      `}
                      >
                        Labs
                      </span>
                    </a>
                  </li>
                  <li className="active-labs-button">
                    <a
                      href="/my-organization/groups"
                      className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                        pathname === "/my-organization/groups"
                          ? "bg-menuHovWhite dark:bg-menuHov"
                          : ""
                      }`}
                    >
                      <User
                        className={` 
                          ${
                            pathname === "/my-organization/groups"
                              ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white dark:fill-white stroke-2"
                              : " "
                          }
                          `}
                      />
                      <span
                        className={`
                      ms-3 
                      ${
                        pathname === "/my-organization/groups"
                          ? "font-semibold"
                          : "font-light "
                      }
                      
                      `}
                      >
                        Groups
                      </span>
                    </a>
                  </li>
                  <li className="active-labs-button">
                    <a
                      href="/my-organization/members"
                      className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                        pathname === "/my-organization/members"
                          ? "bg-menuHovWhite dark:bg-menuHov"
                          : ""
                      }`}
                    >
                      <User
                        className={` 
                          ${
                            pathname === "/my-organization/members"
                              ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white dark:fill-white stroke-2"
                              : " "
                          }
                          `}
                      />
                      <span
                        className={`
                      ms-3 
                      ${
                        pathname === "/my-organization/members"
                          ? "font-semibold"
                          : "font-light "
                      }
                      
                      `}
                      >
                        Members
                      </span>
                    </a>
                  </li>
                  <li className="active-labs-button">
                    <a
                      href="/my-organization/invitation"
                      className={`flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group ${
                        pathname === "/my-organization/invitation"
                          ? "bg-menuHovWhite dark:bg-menuHov"
                          : ""
                      }`}
                    >
                      <User
                        className={` 
                          ${
                            pathname === "/my-organization/invitation"
                              ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white dark:fill-white stroke-2"
                              : " "
                          }
                          `}
                      />
                      <span
                        className={`
                      ms-3 
                      ${
                        pathname === "/my-organization/invitation"
                          ? "font-semibold"
                          : "font-light "
                      }
                      
                      `}
                      >
                        Invitations
                      </span>
                    </a>
                  </li>
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
                          ${
                            pathname === "/my-organization/account"
                              ? "w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white dark:fill-white stroke-2"
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
                          organization Account
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
