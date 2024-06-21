import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

import { Dialog } from "@radix-ui/react-dialog";
import CreateOrgModal from "./CreateOrgModal";
import useOrgCheck from "@/hooks/createOrgCheck";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import OrgdropDown from "./OrgDropDown";
import apiClient from "@/lib/request";

const AltRouteCheck = () => {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const createOrg = async (formData: FormData) => {
    const response = await apiClient.post(`/organization/create/`, formData);
    return response.data;
  };

  const { mutate: createOrganizationMutation } = useMutation(
    (formData: FormData) => createOrg(formData),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("orgName");
        if (session) {
          update({ organization_id: data.data.id });
          router.push("/my-organization");
        }

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
    }
  );

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

  return (
    <div>
      <OrgdropDown />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CreateOrgModal onSubmit={createOrganization} />
      </Dialog>
    </div>
  );
};

export default AltRouteCheck;
