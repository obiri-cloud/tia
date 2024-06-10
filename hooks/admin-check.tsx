"use client"

import { useSession } from "next-auth/react";

const useAdminCheck = () => {
  const { data: session } = useSession();
  let status = session?.user.data.is_admin as boolean;

  return status;
};

export default useAdminCheck;
