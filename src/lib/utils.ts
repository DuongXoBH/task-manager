import { clsx, type ClassValue } from "clsx";
import type { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getCroppedImg = (imageSrc: string, crop: Area): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));

          return;
        }
        resolve(blob);
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};

export const compressImage = (
  imageBlob: Blob,
  maxSize: number
): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const maxWidth = 300;
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxSize) {
              resolve(blob);
            } else {
              canvas.toBlob(
                (compressedBlob) => {
                  resolve(compressedBlob!);
                },
                "image/jpeg",
                0.7
              );
            }
          },
          "image/jpeg",
          0.8
        );
      };
    };
  });
};

export function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
export const isOverdue = (date: Date | undefined): boolean => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isExpiresTomorrow = (date: Date | undefined): boolean => {
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);
  return date >= tomorrow && date < nextDay;
};

export const isExpiresNextWeek = (date: Date | undefined): boolean => {
  if (!date) return false;
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const weekAfter = new Date();
  weekAfter.setDate(today.getDate() + 14);
  return date >= nextWeek && date < weekAfter;
};

export const isExpiresNextMonth = (date: Date | undefined): boolean => {
  if (!date) return false;
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  const monthAfter = new Date();
  monthAfter.setMonth(today.getMonth() + 2);
  return date >= nextMonth && date < monthAfter;
};
