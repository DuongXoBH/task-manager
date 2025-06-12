import axios from "axios";
import { getDefaultStore } from "jotai";
import { useAuthAccessToken, useAuthRefreshToken } from "@/store/auth";
import { toast } from "react-toastify";
import { router } from "@/routes";

const store = getDefaultStore();

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const toastId = "token-expired";

    if (originalRequest.url?.includes("/user/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        store.set(useAuthAccessToken, "");
        store.set(useAuthRefreshToken, "");
        router.navigate({ to: "/login" });
        if (!toast.isActive(toastId)) {
          toast.error("Your session has expired, please Login again.", {
            toastId,
          });
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
