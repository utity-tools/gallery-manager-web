import { useEffect, useState } from "react";
import type { ApiGallery } from "@/lib/types/models";

export function usePublicGallery(slug?: string) {
  const [gallery, setGallery] = useState<ApiGallery | null>(null);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(`/api/public/galleries/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load gallery");
        return res.json();
      })
      .then(setGallery)
      .catch((err) => setError(err.message || "Unable to load gallery"))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { gallery, isLoading, error };
}
