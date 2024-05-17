import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useOrgCheck = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  let status = session?.user.data.subscription_plan === "basic";

  useEffect(() => {
    if (status) {
      router.push("/dashboard");
      toast({
        variant: "destructive",
        title: "Protected Page",
        description:
          "You are being redirected here because you are not an admin",
      });
    }
  }, [status, router]);

  return status;
};

export default useOrgCheck;
