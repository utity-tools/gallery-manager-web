import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createArtist, deleteArtist, getGalleryArtists, updateArtist } from "@/lib/api";
import type { ApiArtist, ArtistInput } from "@/lib/types/models";

interface UseArtistsOptions {
  galleryId?: string;
  page?: number;
  limit?: number;
}

export function useArtists({ galleryId, page = 1, limit = 12 }: UseArtistsOptions = {}) {
  const { data: session } = useSession();
  const [allArtists, setAllArtists] = useState<ApiArtist[]>([]);
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchArtists = useCallback(async () => {
    if (!galleryId) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await getGalleryArtists(galleryId);
      setAllArtists(result.items || []);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load artists");
    } finally {
      setIsLoading(false);
    }
  }, [galleryId, limit]);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;
    fetchArtists();
  }, [session?.user?.id, galleryId, fetchArtists]);

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setArtists(allArtists.slice(start, end));
  }, [allArtists, page, limit]);

  const addArtist = useCallback(
    async (input: ArtistInput) => {
      if (!galleryId) throw new Error("Gallery not found");
      const artist = await createArtist(galleryId, input);
      setAllArtists((prev) => [...prev, artist]);
      setTotal((prev) => prev + 1);
      setTotalPages((prev) => Math.ceil((prev * limit + 1) / limit));
      return artist;
    },
    [galleryId, limit]
  );

  const updateArtistData = useCallback(async (id: string, input: Partial<ArtistInput>) => {
    const updated = await updateArtist(id, input);
    setAllArtists((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const removeArtist = useCallback(async (id: string) => {
    const cascaded = await deleteArtist(id);
    setAllArtists((prev) => prev.filter((a) => a.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    return cascaded;
  }, []);

  return {
    artists,
    isLoading,
    error,
    total,
    totalPages,
    addArtist,
    updateArtist: updateArtistData,
    deleteArtist: removeArtist,
    mutate: fetchArtists,
  };
}
