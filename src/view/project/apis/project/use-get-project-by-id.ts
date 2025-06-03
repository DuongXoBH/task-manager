import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IProjectResponse } from "../../types";

const getProjectById = async (projectId: string, token: string) => {
  const { data } = await api.get<IProjectResponse>(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
export const useGetProjectById = (projectId: string) => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IProjectResponse, AxiosError>({
    queryKey: ["getProjectById", projectId],
    queryFn: () => getProjectById(projectId ?? "", token),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
