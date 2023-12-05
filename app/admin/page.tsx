"use client";
import Overview from "../components/admin/overview";
import Images from "../components/admin/images";
import Labs from "../components/admin/labs";
import ReduxProvider from "@/redux/ReduxProvider";
import GetAdmin from "../components/admin/get-admin";
import useAdminCheck from "@/hooks/admin-check";

export default function DashboardPage() {
  const isAdmin = useAdminCheck();

  if (!isAdmin) {
    return null; 
  }
  return (
    <ReduxProvider>
      <GetAdmin />
      <Overview />
      <Images />
      <Labs />
    </ReduxProvider>
  );
}
