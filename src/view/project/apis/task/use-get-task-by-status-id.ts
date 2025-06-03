import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskResponse } from "../../types";

const getTaskByStatusId = async (statusId: string, token: string) => {
  const { data } = await api.get<ITaskResponse[]>(
    `/task/by_statusId/${statusId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
export const useGetTaskByStatusId = (statusId: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<ITaskResponse[], AxiosError>({
    queryKey: ["getTaskByStatusId", statusId],
    queryFn: () => getTaskByStatusId(statusId ?? "", token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
