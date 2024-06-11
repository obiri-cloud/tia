"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
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
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, ArrowUp, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { userCheck } from "@/lib/utils";

const ROLES = [
  {
    role: "Admin",
    desc: "Admin has full control over Labs, Groups, Members, and Invitations but cannot manage Organization settings.",
  },
  {
    role: "Editor",
    desc: "Editor can modify Labs, Groups, Members, and Invitations, except for billing and organizational settings.",
  },
  {
    role: "Viewer",
    desc: "Viewer has access only to view content, including Labs, Groups, Members, and Invitations.",
  },
  {
    role: "Member",
    desc: "Member has basic access without permissions to view or manage Organization content.",
  },
];

export default function Component() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = session?.user?.tokens?.access_token;
  const queryClient = useQueryClient();
  const orgCheck = useOrgCheck();
  let subscription_plan = session?.user.data.subscription_plan;
  let is_super = session?.user.data.is_superuser;
  let is_admin = session?.user.data.is_admin;
  let role = session?.user.data.role;
  let org_id = session?.user.data.organization_id;

  const createOrg = async (formData: FormData) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/create/`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    return response.data;
  };

  const {
    mutate: createOrganizationMutation,
    isLoading: updating,
    error: UpdateError,
  } = useMutation((formData: FormData) => createOrg(formData), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("orgName");
      if (session) {
        update({ organization_id: data.data.id });
        router.push("/my-organization");
      }

      toast({
        variant: "success",
        title: "Organization created successfully",
      });
    },
    onError: (error: any) => {
      const responseData = error.response.data;
      toast({
        variant: "destructive",
        title: responseData.data,
      });
    },
  });

  const createOrganization = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (document.getElementById("Org-name") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("name", name || "");
    createOrganizationMutation(formData);
  };

  const handleCreateOrgClick = () => {
    setIsOpen(true);
  };

  const getInvitations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/user/org/list/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      userCheck(error as AxiosError);
    }
  };

  const { data: organizations, isLoading } = useQuery(["organizations"], getInvitations);

  const goToOrg = async (e: any, org: any) => {
    e.preventDefault();

    await update({ role: org?.role, organization_id: org.organization.id });
    router.push("/my-organization");
  };

  const manageOrganization = async (e: any) => {
    e.preventDefault();
    await update({ role, organization_id: orgCheck.id });
    router.push("/my-organization/overview");
  };

  const renderDropdownItems = () => {
    if (subscription_plan === "basic") {
      return null;
    }

    if (orgCheck.value) {
      return (
        <>
          <DropdownMenuItem onClick={handleCreateOrgClick}>
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4" />
              Create organization
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/admin">
              <div className="flex items-center gap-2">
                <AdminIcon className="h-4 w-4" />
                Go to Admin
              </div>
            </Link>
          </DropdownMenuItem>
        </>
      );
    } else if (
      is_super ||
      subscription_plan === "premium" ||
      subscription_plan === "standard"
    ) {
      return (
        <>
          <DropdownMenuItem onClick={manageOrganization}>
            <div className="flex items-center gap-2 cursor-pointer">
              <ManageIcon className="h-4 w-4" />
              Manage organization
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/admin">
              <div className="flex items-center gap-2">
                <AdminIcon className="h-4 w-4" />
                Go to Admin
              </div>
            </Link>
          </DropdownMenuItem>
        </>
      );
    } else if (is_admin) {
      return (
        <DropdownMenuItem>
          <Link href="/admin">
            <div className="flex items-center gap-2">
              <AdminIcon className="h-4 w-4" />
              Go to Admin
            </div>
          </Link>
        </DropdownMenuItem>
      );
    }
  };

  const renderOrganizations = () => {
    if (isLoading) {
      return (
        <>
          {new Array(6).fill(1).map((_, i) => (
            <Skeleton
              key={i}
              className="lab-card rounded-2xl p-8 lg:w-[375px] w-full h-[200px]"
            />
          ))}
        </>
      );
    }

    if (organizations && Array.isArray(organizations.data) && organizations.data.length > 0) {
      return organizations.data.map((org:any, index:any) => (
        <TooltipProvider key={index}>
          <DropdownMenuItem>
            <Link
              href={`/dashboard/organizations/${org.organization.id}/groups?name=${org.organization.name}`}
              className="flex justify-between w-full items-center gap-2"
            >
              <span>{org.organization.name}</span>
              {org.role !== "Member" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium underline" onClick={(e)=>goToOrg(e,org)}>
                      {org.role}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className=" z-10 w-[200px] bg-white text-gray-800 p-2 rounded-lg shadow-md border border-gray-300">
                    <p>
                      {ROLES.find((role) => role.role === org.role)?.desc}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </Link>
          </DropdownMenuItem>
        </TooltipProvider>
      ));
    }

    return <p>No organizations found</p>;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4" />
            <span>My Organization</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="font-medium">My Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[200px] overflow-y-auto">
          {renderDropdownItems()}
        </div>
        <DropdownMenuItem>
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <AdminIcon className="h-4 w-4" />
              Go to Labs
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-medium">Other Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[200px] overflow-y-auto">
          {renderOrganizations()}
        </div>
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