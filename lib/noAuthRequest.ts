import axios from "axios";

const noAuthClient = () => {
  const instance = axios.create({
    baseURL: `/api/v1`,
    timeout: 20000,
  });

  instance.interceptors.request.use(async (request) => {
    request.headers["Accept"] = "application/json";
    request.headers["Content-Type"] = "application/json";

    return request;
  });

  return instance;
};

export default noAuthClient();
