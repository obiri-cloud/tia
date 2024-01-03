"use client"
import GetAdmin from "@/app/components/admin/get-admin";
import Labs from "@/app/components/admin/labs";
import useAdminCheck from "@/hooks/admin-check";
import ReduxProvider from "@/redux/ReduxProvider";
import React from "react";

const page = () => {
  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    return null;
  }
  return (
    <ReduxProvider>
      <div className="p-4">
        <GetAdmin />
        <Labs />
      </div>
    </ReduxProvider>
  );
};

export default page;
