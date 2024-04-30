"use client";
import Overview from "../components/admin/overview";
import Images from "../components/admin/images";
import Labs from "../components/admin/labs";
import ReduxProvider from "@/redux/ReduxProvider";
import GetAdmin from "../components/admin/get-admin";
import useAdminCheck from "@/hooks/admin-check";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const isAdmin = useAdminCheck();
  const { data: session } = useSession();

  if (!isAdmin) {
    return null;
  }
  
  return (
      <div className="">
        <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
          <div className="flex items-center">
            <span className="p-2 ">Overview</span>
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          </div>
          {
            //@ts-ignore
            session?.user && session?.user.data.is_admin ? (
              <Link href="/dashboard" className="font-medium text-mint">
                Go to labs
              </Link>
            ) : null
          }
        </div>
        <div className="p-4">
          <GetAdmin />
          <Overview />
        </div>
        {/* <Images />
        <Labs /> */}
      </div>

  );
}
