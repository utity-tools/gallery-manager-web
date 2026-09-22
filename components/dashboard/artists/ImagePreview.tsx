import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  url?: string;
  alt: string;
  size?: "sm" | "lg";
  testId?: string;
}

const SIZE_PX: Record<NonNullable<ImagePreviewProps["size"]>, number> = {
  sm: 100,
  lg: 300,
};

export default function ImagePreview({ url, alt, size = "sm", testId }: ImagePreviewProps) {
  const px = SIZE_PX[size];

  if (!url) {
    return (
      <div
        data-testid={testId}
        style={{ width: px, height: px }}
        className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50"
      >
        <ImageIcon size={size === "sm" ? 24 : 40} className="text-gray-300" />
      </div>
    );
  }

  return (
    <div
      data-testid={testId}
      style={{ width: px, height: px }}
      className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
    >
      <Image src={url} alt={alt} fill sizes={`${px}px`} className="object-cover" unoptimized />
    </div>
  );
}
