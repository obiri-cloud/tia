"use client";
import {
  ILabImage,
  ISession,
  NoInvitationsResponse,
  OrganizationGroup,
} from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useQuery } from "react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AltRouteCheck from "@/app/components/alt-route-check";
import { Arrow } from "@/public/svgs/Arrow";
import apiClient from "@/lib/request";

const OrganizationPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  const name = searchParams.get("name");

  const getOrgnaizationImages = async (): Promise<
    OrganizationGroup | undefined
  > => {
    try {
      const response = await apiClient.get(`/user/org/${id}/groups/`);
      console.log("Response", response);

      return response.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const { data: groups, isLoading } = useQuery(["organization", id], () =>
    getOrgnaizationImages()
  );

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <Link
            href={`/dashboard/organizations`}
            className=" dark:hover:bg-menuHov hover:bg-menuHovWhite p-2 rounded-md"
          >
            Organizations
          </Link>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          {name ? (
            <span className="p-2 rounded-md">{name}</span>
          ) : (
            <Skeleton className="w-[300px] h-[16.5px] rounded-md" />
          )}
        </div>
        <AltRouteCheck />
      </div>

      {/* <div className="p-4 ">
        {!isLoading && groups ? (
          groups.data.length === 0 ? (
            <p className="dark:text-white text-black w-full text-center">
              You have not being added to any group in this organization...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Group Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.data.map((group, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Link
                        href={`/dashboard/organizations/${id}/groups/${group.id}?name=${name}&group_name=${group.name}`}
                        className="text-blue-500 underline"
                      >
                        {group.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        ) : (
          "Loading"
        )}
      </div> */}

      <div className="p-4 ">
        {!isLoading && groups ? (
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
            {groups && groups.data.length >= -1 ? (
              groups.data.map((group, i) => (
                <Link
                  href={`/dashboard/organizations/${id}/groups/${group.id}?name=${name}&group_name=${group.name}`}
                  key={i}
                  className={`lab-card rounded-2xl p-8 w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
                >
                  <div className="mt-[40px] ">
                    <h6 className="font-semibold  leading-[140%] text-4xl app-text-clip h-[65px] max-h-[65px]">
                      {group.name}
                    </h6>
                  </div>
                  <span className="flex gap-[10px] items-center h-fit lg:mt-[36px] mt-[28px] font-medium ">
                    <h5 className="leading-[150%] font-medium">Go to group</h5>
                    <Arrow className="pointer  -rotate-45 transition-all delay-150 dark:fill-white fill-black" />
                  </span>
                </Link>
              ))
            ) : (
              <>
                {new Array(6).fill(1).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="lab-card rounded-2xl p-8 lg:w-[375px] w-full  h-[200px]"
                  />
                ))}
              </>
            )}

            {groups && groups.data.length === 0 ? (
              <div className="w-full flex justify-center  items-center col-span-12">
                <p className="text-gray-600 dark:text-white">
                  No images found...
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
            {new Array(6).fill(1).map((_, i) => (
              <Skeleton
                key={i}
                className="lab-card rounded-2xl p-8  w-full  h-[200px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationPage;
