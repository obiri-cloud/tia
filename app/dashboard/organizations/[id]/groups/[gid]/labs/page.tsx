"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import MainLabPage from "@/app/components/dashboard/main-lab-page";

const OrganizationLab = async () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const gid = params.gid;
  const id = params.id;

  const image = searchParams.get("image");
  let baseUrl = `/user/org/${id}/group/${gid}/image/${image}`;
  let labDeletionUrl = `/${baseUrl}/lab/delete/`;
  let redirectUrl = `/dashboard/organizations/${id}/groups/${gid}?name=&group_name=`;

  return (
    <MainLabPage labDeletionUrl={labDeletionUrl} redirectUrl={redirectUrl} />
  );
};

export default OrganizationLab;
