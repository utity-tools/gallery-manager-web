import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtworkDetailView from "@/components/gallery-public/ArtworkDetailView";
import { getArtistName } from "@/lib/types/models";
import { api } from "@/lib/api";
import type { ApiArtist, ApiArtwork, ArtworksPage } from "@/lib/types/models";

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string; artworkId: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * The backend has no GET /api/*artworks/:id or /api/*artists/:id — only list
 * endpoints exist (confirmed live: both return 404). So we fetch the full
 * public artworks + artists lists for the gallery and look the target up
 * client-side. limit=200 is a pragmatic ceiling, not a real "fetch all".
 */
async function getArtworkDetail(
  slug: string,
  artworkId: string
): Promise<{
  artwork: ApiArtwork;
  artist: ApiArtist | null;
  relatedWorks: ApiArtwork[];
  prevArtwork: ApiArtwork | null;
  nextArtwork: ApiArtwork | null;
} | null> {
  try {
    const [artworksRes, artistsRes] = await Promise.all([
      api.get<BackendEnvelope<ArtworksPage>>(`/public/galleries/${slug}/artworks`, {
        params: { limit: 200 },
      }),
      api.get<BackendEnvelope<ApiArtist[]>>(`/public/galleries/${slug}/artists`),
    ]);

    const artworks = artworksRes.data.data.artworks;
    const index = artworks.findIndex((a) => a.id === artworkId);
    if (index === -1) return null;

    const artwork = artworks[index];
    const artist = artistsRes.data.data.find((a) => a.id === artwork.artist?.id) ?? null;

    const relatedWorks = artworks
      .filter((a) => a.id !== artwork.id && a.artist?.id && a.artist.id === artwork.artist?.id)
      .slice(0, 4);

    return {
      artwork,
      artist,
      relatedWorks,
      prevArtwork: index > 0 ? artworks[index - 1] : null,
      nextArtwork: index < artworks.length - 1 ? artworks[index + 1] : null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArtworkDetailPageProps): Promise<Metadata> {
  const { slug, artworkId } = await params;
  const result = await getArtworkDetail(slug, artworkId);
  if (!result) return { title: `Artwork | Gallery Manager` };
  return { title: `${result.artwork.title} — ${getArtistName(result.artwork)} | Gallery Manager` };
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { slug, artworkId } = await params;
  const result = await getArtworkDetail(slug, artworkId);

  if (!result) {
    notFound();
  }

  return <ArtworkDetailView slug={slug} {...result} />;
}
