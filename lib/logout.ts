import { signOut } from "next-auth/react";

export const logout = () => {
  signOut({ callbackUrl: "/login" });
};
