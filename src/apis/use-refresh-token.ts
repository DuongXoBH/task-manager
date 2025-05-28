import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

export const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await api.post<string>("/auth/refresh", { refreshToken });
  return data;
};
export const useRefreshAccessToken = (onSuccess: (data: string) => void) => {
  return useMutation({
    mutationFn: (refreshToken: string) => refreshAccessToken(refreshToken),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
};
