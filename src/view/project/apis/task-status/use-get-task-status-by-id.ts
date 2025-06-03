import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskStatusResponse } from "../../types";

const getTaskStatusById = async (statusId: string, token: string) => {
  const { data } = await api.get<ITaskStatusResponse>(
    `/task_status/by_statusId/${statusId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
export const useGetTaskStatusById = (statusId: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<ITaskStatusResponse, AxiosError>({
    queryKey: ["getTaskStatusById", statusId],
    queryFn: () => getTaskStatusById(statusId, token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
