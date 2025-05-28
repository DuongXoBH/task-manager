import axios from "axios";
import { getDefaultStore } from "jotai";
import { useAuthAccessToken, useAuthRefreshToken } from "@/store/auth";
import { toast } from "react-toastify";

const store = getDefaultStore();
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        store.set(useAuthAccessToken, "");
        store.set(useAuthRefreshToken, "");
        toast.error("Your session has expired, please log in again.");
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
