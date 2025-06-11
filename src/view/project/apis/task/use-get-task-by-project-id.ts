import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { ITaskResponse } from "../../types";
import { useFilterTask } from "../../store";
import { useMemo } from "react";

const getTaskByProjectId = async (
  projectId: string,
  token: string,
  params: URLSearchParams
) => {
  const { data } = await api.get<ITaskResponse[]>(
    `/task/by_projectId/${projectId}?${params.toString()}`,
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
  const [filters] = useAtom(useFilterTask);
  const queryClient = useQueryClient();
  const params = useMemo(() => {
    const params = new URLSearchParams();
    if (filters?.completed !== undefined) {
      params.append("completed", String(filters.completed));
    }
    if (filters?.isNoExpiration !== undefined) {
      params.append("isNoExpiration", String(filters.isNoExpiration));
    }
    if (filters?.isOverdue !== undefined) {
      params.append("isOverdue", String(filters.isOverdue));
    }
    if (filters?.fromDate) {
      params.append("fromDate", filters.fromDate.toISOString());
    }
    if (filters?.toDate) {
      params.append("toDate", filters.toDate.toISOString());
    }
    queryClient.invalidateQueries({
      queryKey: ["getTaskStatus", projectId],
    });
    return params;
  }, [filters]);

  return useQuery<ITaskResponse[], AxiosError>({
    queryKey: ["getTaskByProjectId", projectId, filters],
    queryFn: () => getTaskByProjectId(projectId ?? "", token, params),
    enabled: !!token && !!userInfo?._id,
  });
};
