"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setOrgName } from "@/redux/reducers/OrganizationSlice";

const OrganizationHeader = () => {
  const { data: session } = useSession();
  const name = useSelector((state: RootState) => state.orgOwner.name);
  const dispatch = useDispatch()
  console.log("name", name);
  

  const token = session?.user!.tokens?.access_token;
  const ord_id = session?.user!.data?.organization_id;

  const {
    data: details,
    isLoading
  } = useQuery(["orgName"], () => getOrg(), {
    enabled: name? false: true
  });

  const getOrg = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${ord_id}/retrieve/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // dispatch(setOrgName(response.data.data.name))

      return response.data.data;
    } catch (error) {
      
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Link href={`/my-organization/overview`}>
        {isLoading  ? <Skeleton className="h-4 w-[200px]" /> : <span className="capitalize">{details?.name} Organization</span>}
      </Link>
    </div>
  );
};

export default OrganizationHeader;