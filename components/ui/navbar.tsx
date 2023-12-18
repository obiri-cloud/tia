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
    <header className="grid grid-flow-col lg:auto-cols-fr items-center py-4 md:py-0 md:h-header md:min-h-header">
      <div className="flex space-x-1 items-center md:w-auto md:min-w-0 flex-none">
        <a
          title="Dashboard"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center mr-4"
          href="/"
        >
          <svg
            className="rounded-full logo w-6 h-6 md:w-8 md:h-8"
            aria-label="Railway Logo"
            width="1024"
            height="1024"
            viewBox="0 0 1024 1024"
            fill="none"
          >
            <path
              d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z"
              fill="#000"
            ></path>
            <path
              d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z"
              fill="#000"
            ></path>
          </svg>
          <span className="ml-4 text-xl font-bold hidden">Railway</span>
        </a>
        <p className="text-lg flex items-center justify-center text-center md:text-left md:justify-start font-semibold ml-4 overflow-hidden overflow-ellipsis min-w-0">
          New Project
        </p>
      </div>
      <nav className="flex items-center ml-auto space-x-8">
        <a
          href="https://blog.railway.app"
          target="_blank"
          rel="noreferrer"
          name="Blog Nav"
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-blog"
        >
          Blog
        </a>
        <a
          href="https://docs.railway.app"
          target="_blank"
          rel="noreferrer"
          name="Docs Nav"
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-docs"
        >
          Docs
        </a>
        <a
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-about"
          href="/about"
        >
          About
        </a>
        <a
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-help"
          href="/help"
        >
          Help
        </a>
        <a
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 flex items-center space-x-2 nav-link-careers"
          href="/careers"
        >
          <span>Careers</span>
          <span className="bg-pink-50 text-pink-500 rounded h-5 w-5 text-xs flex items-center justify-center">
            2
          </span>
        </a>
        <a
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-pricing"
          href="/pricing"
        >
          Pricing
        </a>
        <button
          as="button"
          className="font-semibold text-sm text-gray-500 rounded-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-700 nav-link-login"
        >
          Login
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
