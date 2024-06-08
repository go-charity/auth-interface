import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export const authBackendInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BACKEND_HOST,
  withCredentials: true,
  timeout: 200 * 1000,
});

authBackendInstance.interceptors.request.use(
  (config) => {
    const access_token = getCookie("otp_access_token");
    const refresh_token = getCookie("otp_refresh_token");

    process.env.NEXT_PUBLIC_AUTH_BACKEND_KEY &&
      (config.headers["Api-key"] = window.btoa(
        process.env.NEXT_PUBLIC_AUTH_BACKEND_KEY
      ));

    config.headers["Authorization"] = `Bearer ${access_token}`;
    config.headers["Refresh-token"] = refresh_token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
