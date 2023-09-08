import axios from "axios";

export const authBackendInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BACKEND_HOST,
  withCredentials: true,
});

authBackendInstance.interceptors.request.use(
  (config) => {
    config.headers["Api-key"] = window.btoa("fe132312b2fb42bebb044162ef40e3ce");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
