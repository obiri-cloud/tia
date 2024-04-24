"use client";
import { userCheck } from "@/lib/utils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
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
import Link from "next/link";
import { InvitationsResponse, NoInvitationsResponse } from "@/app/types";



const OrganizationsPage = () => {
  const { data: session } = useSession();

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

  const { data: invites, isLoading } = useQuery(["invite-list"], () =>
    getInvitations()
  );

  return (
    <div className="">
      <div className="border-b dark:border-b-[#2c2d3c] border-b-whiteEdge flex justify-between items-center gap-2 p-2">
        <div className="flex items-center">
          <span className="p-2 ">Organizations</span>
          <ChevronRight className="w-[12px] dark:fill-[#d3d3d3] fill-[#2c2d3c] " />
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
        {!isLoading && invites ? (
          isNoInvitationsResponse(invites) ? (
            <p className="dark:text-white text-black w-full text-center">
              {invites.message}...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Organiztion Name</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.data.map((inv, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Link
                        href={`/dashboard/organizations/${inv.organization.id}/groups?name=${inv.organization.name}`}
                        className="text-blue-500 underline"
                      >
                        {inv.organization.name}
                      </Link>
                    </TableCell>
                    <TableCell>{inv.organization.owner.username}</TableCell>
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

export default OrganizationsPage;

function isNoInvitationsResponse(
  invites: NoInvitationsResponse | InvitationsResponse
): invites is NoInvitationsResponse {
  return (
    (invites as NoInvitationsResponse).message !== undefined &&
    (invites as NoInvitationsResponse).status === 404
  );
}
