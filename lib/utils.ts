import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { signOut } from "next-auth/react";
import secureLocalStorage from "react-secure-storage";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function userCheck(error: AxiosError | null) {
  if (
    error instanceof AxiosError &&
    //@ts-ignore
    error.response.data.code === "user_not_found"
  ) {
    signOut();
    secureLocalStorage.removeItem("tialabs_info");
  }
}
