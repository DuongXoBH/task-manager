import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskResponse } from "../../types";

const getTaskByProjectId = async (projectId: string, token: string) => {
  const { data } = await api.get<ITaskResponse[]>(
    `/task/by_projectId/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
export const useGetTaskByProjectId = (projectId: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<ITaskResponse[], AxiosError>({
    queryKey: ["getTaskByProjectId", projectId],
    queryFn: () => getTaskByProjectId(projectId ?? "", token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
