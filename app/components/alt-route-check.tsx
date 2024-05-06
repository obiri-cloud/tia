import axios from "axios";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog } from "@radix-ui/react-dialog";
import CreateOrgModal from "./CreateOrgModal";
import useOrgCheck from "@/hooks/createOrgCheck";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

const AltRouteCheck = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); 
  const router=useRouter()
//@ts-ignore
  const token = session?.user?.tokens?.access_token;
  const queryClient = useQueryClient();
  const orgCheck = useOrgCheck();
//@ts-ignore
  let subscription_plan = session?.user.data.subscription_plan;
  //@ts-ignore
  let is_super = session?.user.data.is_superuser;
  //@ts-ignore
  let is_admin = session?.user.data.is_admin;

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
    return response.data;
  };

  const {
    mutate: createOrganizationMutation,
    isLoading: updating,
    error: UpdateError,
  } = useMutation((formData: FormData) => createOrg(formData), {
    onSuccess: () => {
      queryClient.invalidateQueries("orgName");
      router.push('/my-organization')
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
    //@ts-ignore
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

  function renderAltRoute() {
    if (orgCheck) {
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
          <Link href="/my-organization" className="font-medium text-mint">
            Manage organization
          </Link>
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