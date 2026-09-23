import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createArtwork, deleteArtwork, getArtworks, updateArtwork } from "@/lib/api";
import type { ApiArtwork, ArtworkInput } from "@/lib/types/models";

interface UseArtworksOptions {
  galleryId?: string;
  page?: number;
  limit?: number;
}

export function useArtworks({ galleryId, page = 1, limit = 12 }: UseArtworksOptions = {}) {
  const { data: session } = useSession();

  const [artworks, setArtworks] = useState<ApiArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;

    let cancelled = false;

    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getArtworks(galleryId, page, limit);
        if (!cancelled) {
          setArtworks(result.items || []);
          setTotal(result.total);
          setTotalPages(result.pages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load artworks");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchArtworks();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, galleryId, page, limit]);

  const add = useCallback(
    async (input: ArtworkInput) => {
      if (!galleryId) throw new Error("Gallery not found");
      const artwork = await createArtwork(galleryId, input);
      setArtworks((prev) => [...prev, artwork]);
      setTotal((prev) => prev + 1);
      return artwork;
    },
    [galleryId]
  );

  const update = useCallback(async (artworkId: string, updates: Partial<ArtworkInput>) => {
    const updated = await updateArtwork(artworkId, updates);
    setArtworks((prev) => prev.map((a) => (a.id === artworkId ? updated : a)));
    return updated;
  }, []);

  const remove = useCallback(async (artworkId: string) => {
    await deleteArtwork(artworkId);
    setArtworks((prev) => prev.filter((a) => a.id !== artworkId));
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  return { artworks, isLoading, error, total, totalPages, add, update, remove };
}
