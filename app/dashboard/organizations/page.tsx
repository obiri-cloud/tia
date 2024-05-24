"use client";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import { InvitationsResponse, NoInvitationsResponse } from "@/app/types";
import AltRouteCheck from "@/app/components/alt-route-check";
import { Arrow } from "@/public/svgs/Arrow";
import { Skeleton } from "@/components/ui/skeleton";

import { useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROLES } from "@/app/my-organization/members/page";

const OrganizationsPage = () => {
  const { data: session, update } = useSession();

  const router = useRouter();
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getInvitations = async (): Promise<
    NoInvitationsResponse | InvitationsResponse | undefined
  > => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/org/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const { data: orgnizations, isLoading } = useQuery(["organizations"], () =>
    getInvitations()
  );

  const goToOrg = (e: any, org: any) => {
    e.preventDefault();

    update({ role: org?.role, organization_id: org.organization.id });
    router.push("/my-organization");
  };

  return (
    <TooltipProvider>
      <div className="">
        <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
          <div className="flex items-center">
            <span className="p-2 ">Organizations</span>
            <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
          </div>
          <AltRouteCheck />
        </div>

        <div className="p-4 ">
          {!isLoading && orgnizations ? (
            isNoInvitationsResponse(orgnizations) ? (
              <p className="dark:text-white text-black w-full text-center">
                {orgnizations.message}...
              </p>
            ) : (
              <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                {orgnizations && orgnizations.data.length >= -1 ? (
                  orgnizations.data.map((org, i) => (
                    <Link
                      href={`/dashboard/organizations/${org.organization.id}/groups?name=${org.organization.name}`}
                      key={i}
                      className={`lab-card relative rounded-2xl p-8 w-full pl-6 neu-shadow dark:bg-cardDarkBg dark:text-white dark:shadow-none bg-white cursor-pointer`}
                    >
                      {org.role !== "Member" && (
                        <Tooltip>
                          <TooltipTrigger
                            className="absolute top-6 right-6"
                            asChild
                          >
                            <button
                              onClick={(e: any) => goToOrg(e, org)}
                              className="text-sm font-medium underline"
                            >
                              {org.role}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="absolute z-10 w-[200px] bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300">
                            <p>
                              {
                                ROLES.find((role) => role.role === org.role)
                                  ?.desc
                              }
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <div className="mt-[40px] ">
                        <h6 className="font-semibold  leading-[140%] text-4xl app-text-clip h-[65px] max-h-[65px]">
                          {org.organization.name}
                        </h6>
                      </div>
                      <span className="flex gap-[10px] items-center h-fit lg:mt-[36px] mt-[28px] font-medium ">
                        <h5 className="leading-[150%] font-medium">
                          Go to organization
                        </h5>
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

                {orgnizations && orgnizations.data.length === 0 ? (
                  <div className="w-full flex justify-center  items-center col-span-12">
                    <p className="text-gray-600 dark:text-white">
                      No images found...
                    </p>
                  </div>
                ) : null}
              </div>
            )
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
    </TooltipProvider>
  );
};

export default OrganizationsPage;

function isNoInvitationsResponse(
  orgnizations: NoInvitationsResponse | InvitationsResponse
): orgnizations is NoInvitationsResponse {
  return (
    (orgnizations as NoInvitationsResponse).message !== undefined &&
    (orgnizations as NoInvitationsResponse).status === 404
  );
}
