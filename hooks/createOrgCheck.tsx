import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const useOrgCheck = () => {
  const { data: session, update } = useSession();
  let [orgId, setordId] = useState<any>(null);
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

        let user = response.data;
        let sessionUser = session?.user.data;
        interface User {
          avatar: string;
          date_joined: string;
          email: string;
          first_name: string;
          is_active: boolean;
          is_admin: boolean;
          is_superuser: boolean;
          last_login: string;
          last_name: string;
          subscription_plan: string;
          username: string;
          organization_id: string | null;
          role?: string;
        }

        let differences: {
          [key: string]: { userValue: any; sessionUserValue: any };
        } = {};
        if (sessionUser) {
          (Object.keys(user) as Array<keyof User>).forEach((key) => {
            if (user[key] !== sessionUser[key]) {
              differences[key] = {
                userValue: user[key],
                sessionUserValue: sessionUser[key],
              };
            }
          });
        }
        console.log("differences", differences);
        Object.keys(differences).forEach((key) => {
          if (key !== "id" && key !== "is_staff") {
            update({ [key]: differences[key].userValue });
          }
        });

        if (response.data.organization_id === null) {
          sethasOrg(true);
        } else if (response.status === 200) {
          sethasOrg(false);
          setordId(response.data.organization_id);
        }
      } catch (error) {
        console.error("Error checking organization owner:", error);
      }
    };

    getOrgOwner();
  }, []);

  return { value: hasOrg, id: orgId };
};

export default useOrgCheck;
