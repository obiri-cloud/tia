import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = () => {
  const instance = axios.create({
    baseURL: `/api/v1`,
    timeout: 20000,
  });

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    console.log("=>", { session });

    if (session) {
      (request.headers[
        "Authorization"
      ] = `Bearer ${session?.user.tokens?.access_token}`),
        (request.headers["Accept"] = "application/json");
      request.headers["Content-Type"] = "application/json";
    }
    return request;
  });

  // instance.interceptors.response.use(
  //   async (response) =>
  //     new Promise((resolve, reject) => {
  //       if (response.data) {
  //         resolve(response.data);
  //       } else {
  //         resolve(response);
  //       }
  //     }),
  //   (e) =>
  //     new Promise((resolve, reject) => {
  //       if (e.response?.data) {
  //         const { statusCode, message } = e.response.data;
  //         console.log(statusCode, message);
  //       }

  //       return reject(e.response?.data || e.response || e);
  //     })
  // );

  return instance;
};

export default apiClient();
