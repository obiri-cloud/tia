import React from "react";
import Hero from "./components/home/hero";
import Courses from "./components/home/courses";
import Stats from "./components/home/stats";
import Provisioning from "./components/home/provisioning";
import OtherStats from "./components/home/otherstats";
import Footer from "./components/home/footer";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import ThemeToggle from "./components/home/themetoggle";

const Page = () => {

  return (
    <div className="noise relative">
      <nav className="w-full z-10 bg-black p-3 text-white glassBorder sticky top-0">
        <ul className="flex  gap-4 justify-end">
          <li>
            <Link href="/dashboard/explore" className="hover:bg-black/10">
              Link 1
            </Link>
          </li>
          <li>
            <Link href="/dashboard/account" className="hover:bg-black/10">
              Link 2
            </Link>
          </li>
          <li>
            <Link href="/dashboard/account" className="hover:bg-black/10">
              Link 3
            </Link>
          </li>
          <li>
            <Link href="/dashboard/account" className="hover:bg-black/10">
              Link 4
            </Link>
          </li>
        </ul>
      </nav>
      <Hero />
      <Courses />
      {/* <Stats/> */}
      <Provisioning />
      <OtherStats />
      <Footer />

      <ThemeToggle />
    </div>
  );
};

export default Page;
