import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import secureLocalStorage from "react-secure-storage";

const apiClient = () => {
  const instance = axios.create({
    baseURL: `/api/v1`,
    timeout: 20000,
  });

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      (request.headers[
        "Authorization"
      ] = `Bearer ${session?.user.tokens?.access_token}`),
        (request.headers["Accept"] = "application/json");
      request.headers["Content-Type"] = "application/json";
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("error", error);
      
      if (
        error instanceof AxiosError &&
        //@ts-ignore
        (error.response.data.code === "user_not_found" ||
          //@ts-ignore
          error.response.data.code === "user_inactive" ||
          //@ts-ignore
          error.response.data.code === "token_not_valid")
      ) {
        toast({
          variant: "destructive",
          title: "Session Expired",
        });
        // signOut({ callbackUrl: "/login" });
        secureLocalStorage.removeItem("tialabs_info");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default apiClient();
