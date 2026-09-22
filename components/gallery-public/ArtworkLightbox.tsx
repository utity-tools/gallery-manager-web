"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ArtworkLightboxProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export default function ArtworkLightbox({ imageUrl, alt, onClose }: ArtworkLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12"
      style={{ backgroundColor: "rgb(0, 0, 0)" }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 text-white transition-opacity hover:opacity-70"
      >
        <X size={28} strokeWidth={1.5} />
      </button>

      <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image src={imageUrl} alt={alt} fill sizes="90vw" className="object-contain" />
      </div>
    </div>
  );
}
