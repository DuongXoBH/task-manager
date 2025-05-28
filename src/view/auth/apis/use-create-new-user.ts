import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { TRegisterPayload } from "../types/register";
import type { IUserResponse } from "@/types";

const register = async (payload: TRegisterPayload): Promise<IUserResponse> => {
  const { data } = await api.post<IUserResponse>(`/user/`, payload);
  return data;
};

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: TRegisterPayload) => register(payload),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
