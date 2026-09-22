import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistsGrid from "@/components/gallery-public/ArtistsGrid";
import { api } from "@/lib/api";
import type { ApiArtist, ArtworksPage } from "@/lib/types/models";

interface ArtistsPageProps {
  params: Promise<{ slug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

interface ArtistsPageResponse {
  artists: ApiArtist[];
  total: number;
  pages: number;
}

async function getPublicArtistsPageData(
  slug: string
): Promise<{ artists: ApiArtist[]; backgroundImageUrl: string | null } | null> {
  try {
    const [artistsRes, artworksRes] = await Promise.all([
      api.get<BackendEnvelope<ArtistsPageResponse>>(`/public/galleries/${slug}/artists`, {
        params: { page: 1, limit: 12 },
      }),
      api.get<BackendEnvelope<ArtworksPage>>(`/public/galleries/${slug}/artworks`, {
        params: { limit: 1 },
      }),
    ]);
    return {
      artists: artistsRes.data.data.artists,
      backgroundImageUrl: artworksRes.data.data.artworks[0]?.imageUrl ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArtistsPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Artists | ${slug} | Gallery Manager` };
}

export default async function ArtistsPage({ params }: ArtistsPageProps) {
  const { slug } = await params;
  const result = await getPublicArtistsPageData(slug);

  if (!result) {
    notFound();
  }

  return (
    <ArtistsGrid artists={result.artists} slug={slug} backgroundImageUrl={result.backgroundImageUrl} />
  );
}
