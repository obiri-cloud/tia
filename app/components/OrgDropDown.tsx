"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Dialog } from "@radix-ui/react-dialog";
import CreateOrgModal from "./CreateOrgModal";
import useOrgCheck from "@/hooks/createOrgCheck";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { userCheck } from "@/lib/utils";
import { InvitationsResponse, NoInvitationsResponse } from "@/app/types";
import { LayoutDashboard, PlusCircleIcon, Shield, Users2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ProfileHeader from "./admin/profile-header";
import apiClient from "@/lib/request";

export default function OrgDropDown() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();
  const orgCheck = useOrgCheck();
  let subscription_plan = session?.user.data.subscription_plan;
  let is_admin = session?.user.data.is_admin;

  const createOrg = async (data: string) => {
    const response = await apiClient.post(`/organization/create/`, data);
    return response.data;
  };

  const { mutate: createOrganizationMutation } = useMutation(
    (data: string) => createOrg(data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("orgName");
        if (session) {
          update({ organization_id: data.data.id });
          router.push("/my-organization/overview");
        }

        toast({
          variant: "success",
          title: "Organization created successfully",
        });
      },
      onError: (error: any) => {
        console.log("error", error);
        const responseData = error.response.data;
        toast({
          variant: "destructive",
          title: responseData.detail,
          duration: 2000,
        });
      },
    }
  );

  const createOrganization = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (document.getElementById("Org-name") as HTMLInputElement)
      ?.value;

    createOrganizationMutation(JSON.stringify({ name }));
  };

  const handleCreateOrgClick = () => {
    setIsOpen(true);
  };

  const getOrg = async (id: string) => {
    try {
      const response = await apiClient.get(`/organization/${id}/retrieve/`);
      console.log("response.data.data", response.data.data);

      return response.data.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const { data: organization } = useQuery(
    ["organization-details", orgCheck.id],
    () => getOrg(orgCheck.id),
    {
      enabled: !!orgCheck.id, // The query will only run if orgCheck.id is truthy
    }
  );

  const getInvitations = async (): Promise<
    NoInvitationsResponse | InvitationsResponse | undefined
  > => {
    try {
      const response = await apiClient.get(`/user/org/list/`);

      return response.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const { data: otherOrganizations, isLoading } = useQuery(
    ["other-organizations"],
    () => getInvitations()
  );

  const goToOrg = async (e: any, org: any) => {
    console.log('----->',{orgrole:org.role,id:org.organization.id})
    e.preventDefault();
    await update({ role: org.role, organization_id: org.organization.id });
    // router.push("/my-organization/overview");
    window.location.href="/my-organization/overview"
  };


  const goToOrg2 = async (e: any, org: any) => {
    e.preventDefault();
    await update({ organization_id: org.id });
    window.location.href="/my-organization/overview"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center  gap-2 w-full justify-between cursor-pointer">
          <ProfileHeader />
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-sm font-medium">
          My Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[200px] overflow-y-auto">
          {organization ? (
            <DropdownMenuItem>
              <Link href="/my-organization/overview" className="flex">
                <Users2 className="h-4 w-4 mr-2" />
                <span onClick={(e: any) => goToOrg2(e, organization)}>
                  {organization.name}
                </span>
              </Link>
            </DropdownMenuItem>
          ) : subscription_plan !== "basic" ? (
            <DropdownMenuItem
              onClick={handleCreateOrgClick}
              className="flex items-center justify-between cursor-pointer "
            >
              <Link href="#" className="text-gray-400 text-sm">
                Create organization
              </Link>
              <PlusCircleIcon className="h-4 w-4 text-gray-400 ml-2" />
            </DropdownMenuItem>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <DropdownMenuItem
                    disabled
                    onClick={handleCreateOrgClick}
                    className="flex items-center justify-between cursor-pointer "
                  >
                    <Link href="#" className="text-gray-400 text-sm">
                      Create organization
                    </Link>
                    <PlusCircleIcon className="h-4 w-4 text-gray-400 ml-2" />
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  This feature is only available to users on the premium or
                  standard plan.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-sm font-medium">
          Other Organizations
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isLoading && otherOrganizations ? (
          isNoInvitationsResponse(otherOrganizations) ? (
            <p className="dark:text-white text-gray-400 w-full text-center text-sm py-1.5">
              {otherOrganizations.message}...
            </p>
          ) : (
            <div>
              {otherOrganizations &&
                otherOrganizations.data.length >= -1 &&
                otherOrganizations.data.map((org: any, i) => (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Users2 className="h-4 w-4 mr-2" />
                      {org.organization.name}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={(e: any) => goToOrg(e, org)}
                          disabled={org.role === "Member"}
                        >
                          <Link href="/my-organization/overview">
                            <span>Manage organization</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/dashboard/organizations/${org.organization.id}/groups?name=${org.organization.name}`}
                          >
                            <span>Go to labs</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
            </div>
          )
        ) : null}
        {is_admin && !pathname.startsWith("/admin") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Go to admin</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {!pathname?.startsWith("/dashboard") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span>Go to dashboard</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CreateOrgModal onSubmit={createOrganization} />
      </Dialog>
    </DropdownMenu>
  );
}

function BuildingIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AdminIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7v6c0 5.2 3.8 9.4 9 10 5.2-.6 9-4.8 9-10V7L12 2z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function ManageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 9V4h4v5l-2 2-2-2z" />
      <path d="M2 11V9h20v2H2z" />
      <path d="M4 15v-2h16v2H4z" />
      <path d="M6 19v-2h12v2H6z" />
    </svg>
  );
}

function isNoInvitationsResponse(
  orgnizations: NoInvitationsResponse | InvitationsResponse
): orgnizations is NoInvitationsResponse {
  return (
    (orgnizations as NoInvitationsResponse).message !== undefined &&
    (orgnizations as NoInvitationsResponse).status === 404
  );
}
