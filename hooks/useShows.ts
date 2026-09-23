import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createShow, deleteShow, getShows, updateShow } from "@/lib/api";
import type { ApiShow, ShowDetail, ShowInput } from "@/lib/types/models";

interface UseShowsOptions {
  galleryId?: string;
  page?: number;
  limit?: number;
}

/** The create/update endpoints return the full detail DTO; the list holds the lighter list DTO. */
function toApiShow(detail: ShowDetail): ApiShow {
  const { artists, artworks, ...base } = detail;
  return {
    ...base,
    artistNames: artists.map((a) => a.name),
    artworkCount: artworks.length,
  };
}

export function useShows({ galleryId, page = 1, limit = 12 }: UseShowsOptions = {}) {
  const { data: session } = useSession();

  const [allShows, setAllShows] = useState<ApiShow[]>([]);
  const [shows, setShows] = useState<ApiShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;

    let cancelled = false;

    const fetchShows = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getShows(galleryId);
        if (!cancelled) {
          setAllShows(result.items || []);
          setTotal(result.total);
          setTotalPages(result.pages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load exhibitions");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchShows();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, galleryId, page, limit]);

  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setShows(allShows.slice(start, end));
  }, [allShows, page, limit]);

  const add = useCallback(
    async (input: ShowInput) => {
      if (!galleryId) throw new Error("Gallery not found");
      const show = await createShow(galleryId, input);
      setAllShows((prev) => [...prev, toApiShow(show)]);
      setTotal((prev) => prev + 1);
      setTotalPages((prev) => Math.ceil((prev * limit + 1) / limit));
      return show;
    },
    [galleryId, limit]
  );

  const update = useCallback(async (showId: string, updates: Partial<ShowInput>) => {
    const updated = await updateShow(showId, updates);
    setAllShows((prev) => prev.map((s) => (s.id === showId ? toApiShow(updated) : s)));
    return updated;
  }, []);

  const remove = useCallback(async (showId: string) => {
    await deleteShow(showId);
    setAllShows((prev) => prev.filter((s) => s.id !== showId));
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  return { shows, isLoading, error, total, totalPages, add, update, remove };
}
