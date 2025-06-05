import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskStatusResponse } from "../../types";

const getTaskStatus = async (projectId: string | undefined, token: string) => {
  if (!projectId) throw new Error("Missing projectId or token");
  const { data } = await api.get<ITaskStatusResponse[]>(
    `/task_status/by_projectId/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
export const useGetTaskStatus = (projectId: string | undefined) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<ITaskStatusResponse[] | undefined, AxiosError>({
    queryKey: ["getTaskStatus", projectId],
    queryFn: () => getTaskStatus(projectId, token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
