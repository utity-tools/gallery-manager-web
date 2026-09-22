"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useUpload } from "@/hooks/useUpload";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
  currentImage?: string;
  isLoading?: boolean;
  galleryId: string;
}

export default function ImageUpload({
  onUpload,
  onError,
  currentImage,
  isLoading,
  galleryId,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const { upload, isUploading, error: uploadError, clearError } = useUpload(galleryId);
  const error = localError ?? uploadError;

  useEffect(() => {
    setPreview(currentImage ?? null);
  }, [currentImage]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const validateAndSetFile = (candidate: File) => {
    setLocalError(null);
    clearError();

    if (!candidate.type.startsWith("image/")) {
      const message = "Only image files allowed";
      setLocalError(message);
      onError?.(message);
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      const message = "File too large (max 10MB)";
      setLocalError(message);
      onError?.(message);
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(candidate);
    objectUrlRef.current = objectUrl;

    setFile(candidate);
    setPreview(objectUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setLocalError(null);
    try {
      const url = await upload(file);
      onUpload(url);
      setFile(null);
      setPreview(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      onError?.(message);
    }
  };

  const busy = isUploading || isLoading;

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4 text-center transition-colors ${
          isDragging ? "border-accent-500 bg-accent-50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {preview ? (
          <div className="relative h-32 w-full overflow-hidden rounded">
            <Image src={preview} alt="Artwork preview" fill unoptimized className="object-cover" />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Drag an image here, or click to select</p>
        )}
        <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <button type="button" onClick={handleUpload} disabled={busy} className="btn-secondary disabled:opacity-50">
          {isUploading ? "Uploading..." : "Upload image"}
        </button>
      )}

      {error && <p className="text-sm text-danger-600">{error}</p>}
    </div>
  );
}
