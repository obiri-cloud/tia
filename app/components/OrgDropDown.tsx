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
import { useRouter } from "next/navigation";
import { userCheck } from "@/lib/utils";
import { InvitationsResponse, NoInvitationsResponse } from "@/app/types";
import {
  Mail,
  MessageSquare,
  PlusCircle,
  PlusCircleIcon,
  Shield,
  UserPlus,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrganizationHeader from "./admin/OrganizationHeader";
import ProfileHeader from "./admin/profile-header";

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

  const { mutate: createOrganizationMutation } = useMutation(
    (formData: FormData) => createOrg(formData),
    {
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

    const formData = new FormData();
    formData.append("name", name || "");
    createOrganizationMutation(formData);
  };

  const handleCreateOrgClick = () => {
    setIsOpen(true);
  };

  const getOrg = async (id: string) => {
    console.log("here");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${id}/retrieve/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data.data", response.data.data);

      return response.data.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  const { data: organization } = useQuery(
    ["organization-details", orgCheck.id],
    () => getOrg(orgCheck.id)
  );

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

  const { data: otherOrganizations, isLoading } = useQuery(
    ["other-organizations"],
    () => getInvitations()
  );

  const goToOrg = async (e: any, org: any) => {
    e.preventDefault();

    await update({ role: org?.role, organization_id: org.organization.id });
    router.push("/my-organization");
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
                <span>{organization.name}</span>
              </Link>
            </DropdownMenuItem>
          ) : subscription_plan !== "basic" ? (
            <DropdownMenuItem>
              <Link
                href="#"
                onClick={handleCreateOrgClick}
                className="text-gray-400 text-sm"
              >
                Create organization
              </Link>
              <PlusCircleIcon className="h-4 w-4 text-gray-400 ml-2" />
            </DropdownMenuItem>
          ) : (
            <p className="dark:text-white text-gray-400 w-full text-center text-sm py-1.5">
              You are on the free plan. Upgrade to the premium or standard plan
              to create an organization.
            </p>
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
                          <Link href="/my-organization/labs">
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
        {is_admin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/my-organization/overview"
                className="flex items-center"
              >
                <Shield className="h-4 w-4 mr-2" />
                <span>Go to admin</span>
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
