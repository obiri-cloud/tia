import { Metadata } from "next";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/ui/main-nav";
import { Overview } from "@/components/ui/overview";
import { RecentSales } from "@/components/ui/recent-sales";
import { Search } from "@/components/ui/search";
// import TeamSwitcher from "@/components/ui/team-switcher"
// import { UserNav } from "@/components/ui/user-nav"
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="users">Payments</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            {children}
          </Tabs>
        </div>
      </div>
    </>
  );
}
