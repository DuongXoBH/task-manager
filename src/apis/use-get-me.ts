import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { IUserResponse } from "@/types";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken } from "@/store/auth";

const getMe = async (token: string) => {
  const { data } = await api.get<IUserResponse>("/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
export const useGetMe = () => {
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IUserResponse, AxiosError>({
    queryKey: ["getMe", token],
    queryFn: () => getMe(token),
    enabled: !!token,
  });

  return query;
};
