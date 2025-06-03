import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IProjectResponse } from "../../types";

const getProjectByMe = async (userId: string) => {
  const { data } = await api.get<IProjectResponse[]>(
    `/projects/byMe/${userId}`
  );
  return data;
};
export const useGetProjectByMe = () => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IProjectResponse[], AxiosError>({
    queryKey: ["getProjectByMe", userInfo?._id],
    queryFn: () => getProjectByMe(userInfo?._id ?? ""),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
