import { api } from "@/lib/api";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ITaskResponse } from "../../types";
import type { TCreateTaskPayload } from "../../types/create-task";

const createNewTask = async (
  payload: TCreateTaskPayload
): Promise<ITaskResponse> => {
  const { data } = await api.post<ITaskResponse>(`/task`, payload);
  return data;
};

export const useCreateNewTask = () =>
  useMutation({
    mutationFn: (payload: TCreateTaskPayload) => createNewTask(payload),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
