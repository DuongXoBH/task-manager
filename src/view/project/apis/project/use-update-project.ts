import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { IProjectResponse } from "../../types";

type TUpdateProjectPayload = {
  projectId: string;
  memberIds?: string[];
};

const updateProject = async ({
  projectId,
  ...rest
}: TUpdateProjectPayload): Promise<IProjectResponse> => {
  const { data } = await api.patch<IProjectResponse>(
    `/projects/${projectId}`,
    rest
  );
  return data;
};

export const useUpdateProject = (onSuccess: (data: IProjectResponse) => void) =>
  useMutation({
    mutationFn: (payload: TUpdateProjectPayload) => updateProject(payload),
    onSuccess,
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
