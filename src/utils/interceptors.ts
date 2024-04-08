import axios from "axios";

export const authBackendInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BACKEND_HOST,
  withCredentials: true,
});

authBackendInstance.interceptors.request.use(
  (config) => {
    process.env.NEXT_PUBLIC_AUTH_BACKEND_KEY &&
      (config.headers["Api-key"] = window.btoa(
        process.env.NEXT_PUBLIC_AUTH_BACKEND_KEY
      ));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
