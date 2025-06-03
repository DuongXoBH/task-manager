import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ITaskResponse } from "../../types";
import type { TUpdateTaskPayload } from "../../types/update-task";

const updateTask = async (
  taskId: string,
  payload: TUpdateTaskPayload
): Promise<ITaskResponse> => {
  const { data } = await api.patch<ITaskResponse>(`/task/${taskId}`, payload);
  return data;
};

export const useUpdateTask = () =>
  useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: TUpdateTaskPayload;
    }) => updateTask(taskId, payload),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
