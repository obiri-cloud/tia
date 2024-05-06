"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const OrganizationHeader = () => {
  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const {
    data: details,
    isLoading
  } = useQuery(["orgName"], () => getOrg());

  

  const getOrg = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/retrieve/`,
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
    <div className="flex font-medium  justify-center items-center w-full">

      {isLoading?<Skeleton className="h-3 w-[200px]" />:<span className="ms-3  capitalize">{details?.name} Organization</span>}
    </div>
  );
};

export default OrganizationHeader;