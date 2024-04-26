"use client";
import MainImagePage from "@/app/components/dashboard/main-image-page";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";

const ClientWrapper = ({ token }: { token: string }) => {
  const params = useParams();
  const searchParams = useSearchParams();
const pathname = usePathname()
// console.log("pathname", pathname);


  const gid = params.gid;
  const id = params.id;

  const image = searchParams.get("image");
  let baseUrl = `/user/org/${id}/group/${gid}/image/${image}`
  let labCreationUrl = `${baseUrl}/lab/create/`;
  let redirectUrl = `/dashboard/organizations/${id}/groups/${gid}`
  let timeoutRedirectUrl = `/dashboard/organizations/${id}/groups/${gid}?name=Heritage&group_name=Docker`

  return <MainImagePage token={token} labCreationUrl={labCreationUrl} redirectUrl={redirectUrl} />;
};

export default ClientWrapper;
