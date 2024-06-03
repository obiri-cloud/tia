import axios from "axios";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Dialog } from "@radix-ui/react-dialog";
import CreateOrgModal from "./CreateOrgModal";
import useOrgCheck from "@/hooks/createOrgCheck";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const AltRouteCheck = () => {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false); 
  const router = useRouter()

  const token = session?.user?.tokens?.access_token;
  const queryClient = useQueryClient();
  const orgCheck = useOrgCheck();
  let subscription_plan = session?.user.data.subscription_plan;
  let is_super = session?.user.data.is_superuser;
  let is_admin = session?.user.data.is_admin;
  let role = session?.user.data.role;
  let org_id= session?.user.data.organization_id;


  console.log({orgCheck:orgCheck.id})
  const createOrg = async (formData: FormData) => {
    const axiosConfig = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BE_URL}/organization/create/`,
      data: formData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(axiosConfig);
    console.log({data_from_creation1:response.data.data.id});
    // if(session) update({...session,user: {...session.user,data: {...session.user.data,organization_id: response.data.data.id}}});
    return response.data;
  };

  const {
    mutate: createOrganizationMutation,
    isLoading: updating,
    error: UpdateError,
  } = useMutation((formData: FormData) => createOrg(formData), {
    onSuccess: (data) => {
      console.log({data_from_creation:      data.data.id});
      queryClient.invalidateQueries("orgName");
      if (session){
        update({organization_id:data.data.id});
      }

      router.push('/my-organization');
      
      (document.getElementById("Org-name") as HTMLInputElement).value = "";
      toast({
        variant: "success",
        title: "Orgnaization created successfully",
        description: "",
      });
     
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Organization";
    },
    onError: (error: any) => {
      const responseData = error.response.data;
      toast({
        variant: "destructive",
        title: responseData.data,
      });
      (
        document.getElementById("submit-button") as HTMLButtonElement
      ).textContent = "Creating Orgnaization";
    },
  });

  const createOrganization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (document.getElementById("submit-button") as HTMLButtonElement).disabled =
      true;
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Orgnaization";
    (
      document.getElementById("submit-button") as HTMLButtonElement
    ).textContent = "Creating Organization...";
    const name = (document.getElementById("Org-name") as HTMLInputElement)
      ?.value;

    const formData = new FormData();
    formData.append("name", name || "");
    createOrganizationMutation(formData);
  };


  const handleCreateOrgClick = () => {
    setIsOpen(true);
  };


  const getOrg = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URL}/organization/${orgCheck.id}/retrieve/`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      
    }
  };


  const { mutate: updateOrgNameMutation } = useMutation(getOrg, {
    onSuccess: () => {
      console.log('did it !')
      queryClient.invalidateQueries("orgName");
    },
    onError: () => {
    },
  });


  const manageOrganization=async(e:any)=>{
    e.preventDefault()
    updateOrgNameMutation()
    await update({ role: role, organization_id: orgCheck.id });

     router.push('/my-organization/overview');

  }



  
  function renderAltRoute() {
    
    if (subscription_plan === "basic") {
      return null;
    }

    if (orgCheck.value) {
      return (
        <div className="flex gap-4">
          <Link href="#" onClick={handleCreateOrgClick} className="font-medium text-mint">
            Create organization
          </Link>
          <Link href="/admin" className="font-medium text-mint">
            Go to Admin
          </Link>
        </div>
      );
    } else if (is_super || subscription_plan === "premium" || subscription_plan === "standard") {
      return (
        <div className="flex gap-4">
          <p className="font-medium text-mint hover:cursor-pointer" onClick={(e)=>manageOrganization(e)} >
            Manage organization
          </p>
          <Link href="/admin" className="font-medium text-mint">
            Go to Admin
          </Link>
        </div>
      );
    } else if (is_admin) {
      return (
        <div className="flex gap-4">
          <Link href="/admin" className="font-medium text-mint">
            Go to Admin
          </Link>
        </div>
      );
    }
  }

  return (
    <div>
      {renderAltRoute()}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CreateOrgModal onSubmit={createOrganization} />
      </Dialog>
    </div>
  );
};

export default AltRouteCheck;