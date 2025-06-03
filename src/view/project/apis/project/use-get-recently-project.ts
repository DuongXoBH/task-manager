import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IProjectResponse } from "../../types";

const getRecentlyProject = async (userId: string) => {
  const { data } = await api.get<IProjectResponse[]>(
    `/projects/recently/${userId}`
  );
  return data;
};
export const useGetRecentlyProject = () => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IProjectResponse[], AxiosError>({
    queryKey: ["getRecentlyProject", userInfo?._id],
    queryFn: () => getRecentlyProject(userInfo?._id ?? ""),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
