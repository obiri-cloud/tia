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

const OrganizationPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id;
  const name = searchParams.get("name");
  const { data: session } = useSession();

  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  const getOrgnaizationImages = async (): Promise<
    OrganizationGroup | undefined
  > => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/org/${id}/groups/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        {
          //@ts-ignore
          session?.user && session?.user.data.is_admin ? (
            <Link href="/admin" className="font-medium text-mint">
              Go to admin
            </Link>
          ) : null
        }
      </div>

      <div className="p-4 ">
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
      </div>
    </div>
  );
};

export default OrganizationPage;
