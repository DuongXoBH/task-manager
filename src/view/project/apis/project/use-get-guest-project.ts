import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAtom } from "jotai";
import { useAuthAccessToken, useUserInfoStore } from "@/store/auth";
import type { IProjectResponse } from "../../types";

const getGuestProject = async (userId: string) => {
  const { data } = await api.get<IProjectResponse[]>(
    `/projects/asGuest/${userId}`
  );
  return data;
};
export const useGetGuestProject = () => {
  const [userInfo] = useAtom(useUserInfoStore);
  const [token] = useAtom(useAuthAccessToken);
  const query = useQuery<IProjectResponse[], AxiosError>({
    queryKey: ["getGuestProject", userInfo?._id],
    queryFn: () => getGuestProject(userInfo?._id ?? ""),
    enabled: !!token && !!userInfo?._id,
  });

  return query;
};
