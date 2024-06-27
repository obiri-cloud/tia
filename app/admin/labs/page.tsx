"use client";
import GetAdmin from "@/app/components/admin/get-admin";
import Labs from "@/app/components/admin/labs";
import AltRouteCheck from "@/app/components/alt-route-check";
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
        <AltRouteCheck />
      </div>
      <div className="p-4">
        <GetAdmin />
        <Labs />
      </div>
    </ReduxProvider>
  );
};

export default page;
