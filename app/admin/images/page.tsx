"use client";
import React from "react";
import ReduxProvider from "@/redux/ReduxProvider";
import Images from "@/app/components/admin/images";
import GetAdmin from "@/app/components/admin/get-admin";
import useAdminCheck from "@/hooks/admin-check";

const AdminImages = () => {

  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    return null;
  }
  return (
    <ReduxProvider>
      <div className="p-4">
        <GetAdmin />
        <Images />
      </div>
    </ReduxProvider>
  );
};

export default AdminImages;
