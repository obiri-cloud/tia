import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import React from "react";

const DashoardServerWrapper = async ({
  getToken,
}: {
  getToken: () => Promise<string>;
}) => {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  return <div>DashoardServerWrapper</div>;
};

export default DashoardServerWrapper;
