import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { TUpdateMePayload } from "../types/edit-profile";
import type { IUserResponse } from "@/types";
import { api } from "@/lib/api";
import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";

const updateMe = async (
  payload: TUpdateMePayload,
  userId: string | undefined
) => {
  if (userId) return {};
  const { data } = await api.patch<IUserResponse>(`/user/${userId}`, payload);
  return data;
};

export const useUpdateMe = () => {
  const [auth] = useAtom(useUserInfoStore);
  return useMutation({
    mutationFn: (payload: TUpdateMePayload) => updateMe(payload, auth?._id),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
};
