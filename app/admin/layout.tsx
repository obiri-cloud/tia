import { Metadata } from "next";

import AdminCheck from "../../hooks/admin-check";
import { Inter } from "next/font/google";
import { signOut } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { SVGProps } from "react";
import ProfileHeader from "../components/admin/profile-header";

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
         <ProfileHeader/>
          <div className="flex flex-1 flex-col">
            <ul className="space-y-2 font-medium mt-[50px] flex-1">
              <li>
                <a
                  href="/admin"
                  className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                >
                  <OverviewIcon className="w-7 h-7 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white" />
                  <span className="ms-3 font-light">Overview</span>
                </a>
              </li>
              <li>
                <a
                  href="/admin/images"
                  className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                >
                  <AllImages className="w-5 h-5  transition duration-75 dark:group-hover:text-white fill-whiteDark dark:fill-white" />
                  <span className="ms-3 font-light">Images</span>
                </a>
              </li>
              <li>
                  <a
                    href="/dashboard/active-labs"
                    className="flex items-center p-2  rounded-lg dark:text-white dark:hover:bg-menuHov hover:bg-menuHovWhite group"
                  >
                    <ActiveLabs className="w-5 h-5 text-black transition duration-75 dark:group-hover:text-white stroke-whiteDark dark:stroke-white" />
                    <span className="ms-3 font-light">Active Labs</span>
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


const AllImages = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 512 512"
    style={{ width: "24px" }}
  >
    <path
      d="m457.6 140.2-82.5-4-4.8-53.8c-1-11.3-11.1-19.2-22.9-18.3l-296 24.3c-11.8 1-20.3 10.5-19.4 21.7l21.2 235.8c1 11.3 11.2 19.2 22.9 18.3l15-1.2-2.4 45.8c-.6 12.6 9.2 22.8 22.4 23.5L441.3 448c13.2.6 24.1-8.6 24.8-21.2L480 163.5c.6-12.5-9.3-22.7-22.4-23.3zm-355 5.3-7.1 134.8L78.1 305l-16-178v-1c.5-5 4.3-9 9.5-9.4l261-21.4c5.2-.4 9.7 3 10.5 7.9 0 .2.3.2.3.4 0 .1.3.2.3.4l2.7 30.8-219-10.5c-13.2-.4-24.2 8.8-24.8 21.3zm334.1 236.9L390 327.1l-27.5-32.7c-2.4-2.9-6.3-5.3-10.6-5.5-4.3-.2-7.5 1.5-11.1 4.1l-16.4 11.9c-3.5 2.1-6.2 3.5-9.9 3.3-3.6-.2-6.8-1.6-9.1-3.8-.8-.8-2.3-2.2-3.5-3.4l-42.8-48.9c-3.1-3.9-8.2-6.4-13.8-6.7-5.7-.3-11.2 2.1-14.8 5.6L129.4 359.8l-6.8 7.4.3-6.8 6.8-128.9 3.3-62.9v-1c1.4-5.4 6.2-9.3 11.9-9l204.2 9.8 28.7 1.4 58.3 2.8c5.8.3 10.3 4.7 10.4 10.2 0 .2.3.3.3.5s.3.3.3.5l-10.4 198.6z"
      fill="#current"
    ></path>
    <path
      d="M373.2 262.3c19.4 0 35.2-15.8 35.2-35.2s-15.7-35.2-35.2-35.2c-19.4 0-35.2 15.7-35.2 35.2s15.7 35.2 35.2 35.2z"
      fill="#current"
    ></path>
  </svg>
);


const ActiveLabs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="#current"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "20px" }}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);