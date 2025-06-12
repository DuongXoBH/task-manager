import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { TUpdateMePayload } from "../types/edit-profile";
import type { IUpdateResponse } from "@/types";
import { api } from "@/lib/api";
import { useUserInfoStore } from "@/store/auth";
import { useAtom } from "jotai";

const updateMe = async (
  payload: TUpdateMePayload,
  userId: string | undefined
) => {
  const { data } = await api.patch<IUpdateResponse>(`/user/${userId}`, payload);
  return data;
};

export const useUpdateMe = (onSuccess: (data: IUpdateResponse) => void) => {
  const [auth] = useAtom(useUserInfoStore);
  return useMutation({
    mutationFn: (payload: TUpdateMePayload) => updateMe(payload, auth?._id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
};
