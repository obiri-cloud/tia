import { signOut } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";

export const logout = () => {
  signOut({ callbackUrl: "/login" });
  // secureLocalStorage.removeItem("tialabs_info");
};
