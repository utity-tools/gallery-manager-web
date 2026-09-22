import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getGallery, updateGallery } from "@/lib/api";
import type { ApiGallery, GalleryInput } from "@/lib/types/models";

export function useGallery() {
  const { data: session } = useSession();
  const [gallery, setGallery] = useState<ApiGallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    let cancelled = false;

    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGallery();
        if (!cancelled) setGallery(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load gallery");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchGallery();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const updateGalleryData = useCallback(
    async (updates: GalleryInput) => {
      if (!gallery?.id) throw new Error("Gallery not found");
      const updated = await updateGallery(gallery.id, updates);
      setGallery(updated);
      return updated;
    },
    [gallery?.id]
  );

  return { gallery, isLoading, error, updateGalleryData };
}
