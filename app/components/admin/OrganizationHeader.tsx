"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import useOrgCheck from "@/hooks/createOrgCheck";

const OrganizationHeader = () => {
  const { data: session } = useSession();
  const orgCheck = useOrgCheck();

  console.log({fromheader:orgCheck.id});
  
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;
  const ord_id=session?.user!.data?.organization_id
  const {
    data: details,
    isLoading
  } = useQuery(["orgName"], () => getOrg());

  const getOrg = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${orgCheck.id}/retrieve/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // @ts-ignore
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      
    }
  };

  return (
    <div className="flex items-center justify-center">
                <Link
            href={`/my-organization`}
          >
      {isLoading?<Skeleton className="h-3 w-[200px]" />:<span className=" capitalize">{details?.name} Organization</span>}
          </Link>

    </div>
  );
};

export default OrganizationHeader;