import axios from "axios";
import { getSession } from "next-auth/react";

const formClient = () => {
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
      request.headers["Content-Type"] = "multipart/form-data";
    }
    return request;
  });

  return instance;
};

export default formClient();
