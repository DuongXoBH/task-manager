import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Loader, Plus } from "lucide-react";
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

interface IImageUpload {
  defaultImage?: string;
  setAvatar?: (imageUrl: string) => void;
}

export default function ImageUpload({ defaultImage, setAvatar }: IImageUpload) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    defaultImage
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: mutateUploadImage } = useUploadImages();

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
      const formData = new FormData();
      formData.append("image", file);
      const response = await mutateUploadImage(formData);

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
    <div className="space-y-4 flex flex-col justify-center">
      <div className="flex items-center space-x-2">
        <Plus className="h-5 w-5 text-gray-500" />
        <span className="font-medium text-gray-900">Add Background Image</span>
      </div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative flex justify-center items-end "
      >
        {previewImageUrl ? (
          <img
            src={previewImageUrl}
            alt=""
            className="w-[280px] cursor-pointer"
          />
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
              {uploading && <Loader className="mr-2 size-4 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
