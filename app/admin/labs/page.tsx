"use client";
import GetAdmin from "@/app/components/admin/get-admin";
import Labs from "@/app/components/admin/labs";
import ReduxProvider from "@/redux/ReduxProvider";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const page = () => {
  const { data: session } = useSession();

  return (
    <ReduxProvider>
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">All Labs</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        {
          session?.user && session?.user.data.is_admin ? (
            <Link href="/dashboard" className="font-medium text-mint">
              Go to labs
            </Link>
          ) : null
        }
      </div>
      <div className="p-4">
        <GetAdmin />
        <Labs />
      </div>
    </ReduxProvider>
  );
};

export default page;
