
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const useOrgCheck = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.user!.tokens?.access_token;

  let [hasOrg, sethasOrg] = useState(false);

  
  useEffect(() => {
    const getOrgOwner = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_URL}/organization/retrieve/`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 404) {
          sethasOrg(true); 
        } else if (response.data.status === 200) {
          sethasOrg(false); 
        }
      } catch (error) {
        console.error("Error checking organization owner:", error);
      }
    };

    getOrgOwner();
  }, [router, token]);


  return hasOrg;
};

export default useOrgCheck;