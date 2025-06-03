import { api } from "@/lib/api";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ITaskStatusResponse } from "../../types";
import type { TCreateTaskStatusPayload } from "../../types/create-task-status";

const createNewTaskStatus = async (
  payload: TCreateTaskStatusPayload
): Promise<ITaskStatusResponse> => {
  const { data } = await api.post<ITaskStatusResponse>(`/task_status`, payload);
  return data;
};

export const useCreateNewTaskStatus = () =>
  useMutation({
    mutationFn: (payload: TCreateTaskStatusPayload) =>
      createNewTaskStatus(payload),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
