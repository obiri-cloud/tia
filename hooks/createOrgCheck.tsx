import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
 
const useOrgCheck = () => {
  const { data: session } = useSession();
  let [orgId,setordId]=useState<any>(null)
  const token = session?.user!.tokens?.access_token;
  
  let [hasOrg, sethasOrg] = useState<any>();
  
 
  useEffect(() => {
    const getOrgOwner = async () => {
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
        } else if (response.status === 200) {
          sethasOrg(false);
          setordId(response.data.organization_id)
        }
      } catch (error) {
        console.error("Error checking organization owner:", error);
      }
    };
 
    getOrgOwner();
  }, []);
 
  
  return {value:hasOrg,id:orgId};
};
 
export default useOrgCheck;