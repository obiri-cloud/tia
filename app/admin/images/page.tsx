"use client";
import React from "react";
import ReduxProvider from "@/redux/ReduxProvider";
import Images from "@/app/components/admin/images";
import GetAdmin from "@/app/components/admin/get-admin";
import useAdminCheck from "@/hooks/admin-check";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminImages = () => {
  const isAdmin = useAdminCheck();
  const { data: session } = useSession();


  if (!isAdmin) {
    return null;
  }
  return (
    <ReduxProvider>
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">All Images</span>
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
        <Images />
      </div>
    </ReduxProvider>
  );
};

export default AdminImages;
