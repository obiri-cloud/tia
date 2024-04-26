import React from "react";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import MainImagePage from "@/app/components/dashboard/main-image-page";
import { getServerSession } from "next-auth";
import ClientWrapper from "./client-wrapper";

const OrganizationImage = async () => {
  const session = await getServerSession(authOptions);
  
  
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;

  return <ClientWrapper token={token} />;
};

export default OrganizationImage;
