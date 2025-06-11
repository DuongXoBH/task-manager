import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

type TUploadImagePayload = {
  file: File;
  type: "image" | "avatar";
};

const uploadImages = async (file: File, type: "image" | "avatar") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);
  const { data } = await api.post("/files/upload-images", formData);
  return data;
};

export const useUploadImages = () =>
  useMutation({
    mutationFn: ({ file, type }: TUploadImagePayload) =>
      uploadImages(file, type),
    onError: (error: Error) => {
      const { message } = error;
      toast.error(message);
    },
  });
