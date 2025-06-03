import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IUserResponse } from "@/types";

const getUserById = async (userId: string) => {
  const { data } = await api.get<IUserResponse>(`/user/${userId}`);
  return data;
};
export const useGetUserById = (userId: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IUserResponse, AxiosError>({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
