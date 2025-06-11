import { Slider } from "@/components/ui/slider";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface ImageCropperProps {
  type: string | undefined;
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
  showCropper: boolean;
}

export function ImageCropper({
  type,
  imageSrc,
  onCropComplete,
  showCropper,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  if (!showCropper) return null;

  return (
    <>
      <div className="relative h-100 w-full bg-gray-200">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={type === "avatar" ? 1 : 16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div className="mt-5 flex w-full flex-col gap-[10px]">
        <Slider
          min={1}
          max={5}
          step={0.01}
          value={[zoom]}
          onValueChange={(val) => setZoom(val[0])}
        />
        <div className="text-muted-foreground text-xs">x{zoom.toFixed(2)}</div>
      </div>
    </>
  );
}
