import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IUserResponse } from "@/types";

const getUsers = async () => {
  const { data } = await api.get<IUserResponse[]>(`/user`);
  return data;
};
export const useGetUsers = () => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IUserResponse[], AxiosError>({
    queryKey: ["getUsers"],
    queryFn: () => getUsers(),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
