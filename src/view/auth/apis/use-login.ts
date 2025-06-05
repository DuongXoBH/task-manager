import { api } from "@/lib/api";
import type { ILoginResponse } from "@/types";
import type { TLoginPayload } from "../types/login";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const login = async (payload: TLoginPayload): Promise<ILoginResponse> => {
  const { data } = await api.post<ILoginResponse>(`/user/login`, payload);
  return data;
};

export const useLogin = (onSuccess: (data: ILoginResponse) => void) =>
  useMutation({
    mutationFn: (payload: TLoginPayload) => login(payload),
    onSuccess,
    onError: () => {
      toast.error("Invalid email or password. Please try again .");
    },
  });
