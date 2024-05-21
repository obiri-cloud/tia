import { useSession } from "next-auth/react";
import { permissions } from "@/app/helpers/permissions";
import { Role } from "@/app/types";
import { usePathname } from "next/navigation";

const useAuthorization = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const checkAuthorization = () => {
    const userRole = session?.user?.data.role as Role;
    const role = permissions.get(userRole);

    const currentRouterAllowed = role?.links?.find(
      (link) => link.link === pathname
    )? true: false

    return {
      isAuthorized: currentRouterAllowed,
      allowedLinks: role?.links,
    };
  };

  return checkAuthorization();
};

export default useAuthorization;
