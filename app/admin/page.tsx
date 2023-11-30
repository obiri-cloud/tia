"use client";
import Overview from "../components/admin/overview";
import Images from "../components/admin/images";
import Labs from "../components/admin/labs";
import ReduxProvider from "@/redux/ReduxProvider";
import GetAdmin from "../components/admin/get-admin";

export default function DashboardPage() {
  return (
    <ReduxProvider>
      <GetAdmin />
      <Overview />
      <Images/>
      <Labs/>
    </ReduxProvider>
  );
}
