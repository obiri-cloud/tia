"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect } from "react";
import apiClient from "@/lib/request";
import AltRouteCheck from "@/app/components/alt-route-check";

const OverView = () => {
  const { data: session } = useSession();
  const token = session?.user!.tokens?.access_token;
  const org_id = session?.user!.data?.organization_id;
  const [overviewData, setoverViewData] = useState<any>([]);
  const [isLoading, setisloading] = useState(false);

  const getOverview = async () => {
    setisloading(true);
    try {
      const response = await apiClient.get(
        `/organization/${org_id}/statistics/`
      );
      console.log({ statistics: response.data });
      setisloading(false);
      setoverViewData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOverview();
  }, []);

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center ml-2">
          <span className="p-2 ">Organization</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          Overview
        </div>

        <AltRouteCheck />
      </div>
      <div className="flex flex-wrap gap-4 p-5">
        {isLoading ? (
          <>
            <Skeleton className="rounded-lg p-8 lg:w-[375px] w-full h-[150px]" />
            <Skeleton className="rounded-lg p-8 lg:w-[375px] w-full h-[150px]" />
            <Skeleton className="rounded-lg p-8 lg:w-[375px] w-full h-[150px]" />
            <Skeleton className="rounded-lg p-8 lg:w-[375px] w-full h-[150px]" />
          </>
        ) : (
          <>
            <div className="lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer">
              <CardHeader>
                <CardTitle className="text-[30px] font-extrabold">
                  Total Members
                </CardTitle>
                <CardDescription>
                  Number of members in the organization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">
                  {overviewData?.total_members}
                </span>
              </CardContent>
            </div>

            <div className="lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer">
              <CardHeader>
                <CardTitle className="text-[30px] font-extrabold">
                  Total Groups
                </CardTitle>
                <CardDescription>
                  Number of groups in the organization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">
                  {overviewData?.total_groups}
                </span>
              </CardContent>
            </div>

            <div className="lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer">
              <CardHeader>
                <CardTitle className="text-[30px] font-extrabold">
                  Total Labs
                </CardTitle>
                <CardDescription>
                  Number of labs in the organization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">
                  {overviewData?.total_labs}
                </span>
              </CardContent>
            </div>

            <div className="lab-card rounded-2xl p-8 lg:w-[375px] w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer">
              <CardHeader>
                <CardTitle className="text-[25px] font-extrabold">
                  Pending Invitations
                </CardTitle>
                <CardDescription>Number of pending invitations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <span className="text-4xl font-bold">
                  {overviewData?.total_pending_invitations}
                </span>
              </CardContent>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverView;
