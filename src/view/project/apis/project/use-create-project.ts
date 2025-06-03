import { api } from "@/lib/api";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { TCreateProjectPayload } from "../../types/create-project";
import type { IProjectResponse } from "../../types";

const createNewProject = async (
  payload: TCreateProjectPayload
): Promise<IProjectResponse> => {
  const { data } = await api.post<IProjectResponse>(`/projects`, payload);
  return data;
};

export const useCreateNewProject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: TCreateProjectPayload) => createNewProject(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
