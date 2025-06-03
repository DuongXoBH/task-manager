import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

const uploadImages = async (file: FormData) => {
  const { data } = await api.post("/files/upload-images", file);
  return data;
};

export const useUploadImages = () =>
  useMutation({
    mutationFn: (file: FormData) => uploadImages(file),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
