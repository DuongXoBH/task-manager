import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import { getCroppedImg } from "@/lib/utils";

import { ImageCropper } from "./image-cropper";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Area } from "react-easy-crop";
import { useUploadImages } from "@/apis/use-upload-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IImageUpload {
  type: "avatar" | "image";
  defaultImage?: string;
  setAvatar?: (imageUrl: string) => void;
}

export default function ImageUpload({
  type,
  defaultImage,
  setAvatar,
}: IImageUpload) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    defaultImage
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadImageMutate } = useUploadImages();

  useEffect(() => {
    if (dialogOpen) {
      const timer = setTimeout(() => {
        setShowCropper(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setShowCropper(false);
    }
  }, [dialogOpen]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setDialogOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleComplete = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setUploading(true);

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedImage], "avatar.jpg", {
        type: croppedImage.type,
      });
      const response = await uploadImageMutate({ file, type });

      if (response.url) {
        setPreviewImageUrl(response.url);
        setAvatar?.(response.url);
        toast.success("Image uploaded successfully.");
      }
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        toast.error("Something went wrong.");
      }
    } finally {
      setUploading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative flex justify-center items-end cursor-pointer"
      >
        {previewImageUrl ? (
          type === "image" ? (
            <img
              src={previewImageUrl}
              alt=""
              className="w-[280px] cursor-pointer"
            />
          ) : (
            <Avatar isCircle className="size-[70px]">
              <AvatarImage src={previewImageUrl} alt="avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )
        ) : (
          <Button
            type="button"
            className=" text-black bg-gray-200 hover:bg-gray-400 text-center font-medium"
          >
            Upload Images
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/jpeg, image/png"
        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-[10px] border-0 bg-white p-5">
          <DialogTitle></DialogTitle>
          {imageSrc && (
            <ImageCropper
              type={type}
              imageSrc={imageSrc}
              onCropComplete={setCroppedAreaPixels}
              showCropper={showCropper}
            />
          )}

          <DialogFooter className="flex w-full !justify-between">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={uploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={uploading}
              className="bg-blue-400 hover:bg-blue-500 text-black"
              onClick={handleComplete}
            >
              {uploading ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" /> Uploading
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
