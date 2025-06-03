import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

import { toast } from "react-toastify";

const deleteTask = async (taskId: string) => {
  const { data } = await api.delete(`task/${taskId}`);
  return data;
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
};
