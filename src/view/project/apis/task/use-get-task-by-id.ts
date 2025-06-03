import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskResponse } from "../../types";

const getTaskById = async (id: string, token: string) => {
  const { data } = await api.get<ITaskResponse>(`/task/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
export const useGetTaskById = (id: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<ITaskResponse, AxiosError>({
    queryKey: ["getTaskById", id],
    queryFn: () => getTaskById(id ?? "", token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
