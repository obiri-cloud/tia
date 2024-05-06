"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const useAdminCheck = () => {
  const { data: session } = useSession();
  const router = useRouter();
  //@ts-ignore
  let status = session?.user.data.is_admin as boolean;
  console.log("status", status);

  return status;
};

export default useAdminCheck;
