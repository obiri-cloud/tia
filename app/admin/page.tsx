"use client";
import Overview from "../components/admin/overview";
import GetAdmin from "../components/admin/get-admin";
import { ChevronRight } from "lucide-react";
import AltRouteCheck from "../components/alt-route-check";

export default function DashboardPage() {
  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Overview</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
        </div>
        <AltRouteCheck />
      </div>
      <div className="p-4">
        <GetAdmin />
        <Overview />
      </div>
    </div>
  );
}
