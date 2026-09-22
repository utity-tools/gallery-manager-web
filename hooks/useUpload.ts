import { useCallback, useState } from "react";
import { uploadImage } from "@/lib/api";

export function useUpload(galleryId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setError(null);
      setIsUploading(true);
      try {
        const url = await uploadImage(file, galleryId);
        return url;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [galleryId]
  );

  const clearError = useCallback(() => setError(null), []);

  return { upload, isUploading, error, clearError };
}
