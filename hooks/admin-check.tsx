import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useAdminCheck = () => {
  const { data: session } = useSession();
  const router = useRouter();
  //@ts-ignore
  let status = session?.user.data.is_admin as boolean;

  useEffect(() => {
    if (!status) {
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

export default useAdminCheck;
