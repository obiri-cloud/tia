import { Metadata } from "next";

import AdminCheck from "../../hooks/admin-check";
import { Inter } from "next/font/google";
import { signOut } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { SVGProps } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};
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

  return (
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
          aria-hidden="true"
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
        className="fixed top-0 left-0 z-40 w-[220px] h-screen transition-transform -translate-x-full sm:translate-x-0 border-r dark:border-r-[#2c2d3c] border-r-whiteEdge dark:text-dashboardText dark:bg-[#191a23] bg-white text-whiteDark  "
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center w-full">
            <a className="flex items-center p-2  text-white rounded-lg  hover:bg-menuHov group bg-pink-200">
              <span>SY</span>
            </a>
            <span className="ms-3 font-light">Sylvester</span>
          </div>
          <div className="flex flex-1 flex-col">
            <ul className="space-y-2 font-medium mt-[50px] flex-1">
              <li>
                <a
                  href="/dashboard/active-labs"
                  className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                >
                  <Logout className="w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white" />
                  <span className="ms-3 font-light">Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                >
                  <Logout className="w-5 h-5  transition duration-75 dark:group-hover:text-white fill-whiteDark dark:fill-white" />
                  <span className="ms-3 font-light">Images</span>
                </a>
              </li>
            </ul>
            <div className="">
              <ul className="space-y-2 font-medium">
                {/* <li>
                  <a
                    href="/dashboard/account"
                    className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                  >
                    <Account className="w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white dark:fill-white" />
                    <span className="ms-3 font-light">Payments</span>
                  </a>
                </li> */}
                <li>
                  <span
                    // onClick={logout}
                    className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group cursor-pointer"
                  >
                    <Logout className="w-5 h-5  transition duration-75 dark:group-hover:text-white fill-whiteDark dark:fill-white" />
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
  );
}

const Logout = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    height="32"
    viewBox="0 0 32 32"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title />
    <g data-name="1" id="_1">
      <path
        d="M27,3V29a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V27H7v1H25V4H7V7H5V3A1,1,0,0,1,6,2H26A1,1,0,0,1,27,3ZM10.71,20.29,7.41,17H18V15H7.41l3.3-3.29L9.29,10.29l-5,5a1,1,0,0,0,0,1.42l5,5Z"
        id="logout_account_exit_door"
        fill="#current"
        stroke="#current"
      />
    </g>
  </svg>
);

const OverviewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    enable-background="new 0 0 91 91"
    height="91px"
    id="Layer_1"
    version="1.1"
    viewBox="0 0 91 91"
    width="91px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M42.762,19.428h-1.701v6.887c-12.799,0.88-22.949,11.545-22.949,24.563c0,13.592,11.059,24.65,24.65,24.65   c13.016,0,23.682-10.152,24.561-22.949h6.887v-1.701C74.209,33.536,60.102,19.428,42.762,19.428z M42.762,72.127   c-11.719,0-21.25-9.533-21.25-21.25c0-11.145,8.623-20.313,19.549-21.182v22.883h22.881C63.072,63.503,53.906,72.127,42.762,72.127   z M67.408,49.178H44.461V26.229v-3.35c14.115,0.848,25.449,12.184,26.297,26.299H67.408z" />
    </g>
  </svg>
);
