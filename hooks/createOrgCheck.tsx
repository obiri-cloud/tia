
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const useOrgCheck = () => {
  const { data: session,update } = useSession();
  const router = useRouter();
  const token = session?.user!.tokens?.access_token;
  const ord_id=session?.user!.data?.organization_id
  let orgId;
  
  let [hasOrg, sethasOrg] = useState(false);


  console.log({ord_id});
  

  useEffect(() => {
    const getOrgOwner = async () => {
      // if(!ord_id){
      //   return null
      // }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_URL}/auth/user/`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

       console.log({response});
        if (response.data.organization_id === null) {
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