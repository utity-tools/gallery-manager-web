import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtworkDetailView from "@/components/gallery-public/ArtworkDetailView";
import { getArtistName } from "@/lib/types/models";
import { api } from "@/lib/api";
import type { ApiArtist, ApiArtwork } from "@/lib/types/models";

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string; artworkId: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

interface ArtworkDetailResponse {
  id: string;
  title: string;
  imageUrl?: string;
  artist?: { id: string; name: string; slug: string };
  year?: number;
  price?: number;
  description?: string;
  medium?: string;
  dimensions?: string;
  createdAt: string;
  updatedAt: string;
}

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
    const res = await api.get<BackendEnvelope<ArtworkDetailResponse>>(
      `/public/galleries/${slug}/artworks/${artworkId}`
    );
    const artwork = res.data.data as unknown as ApiArtwork;

    return {
      artwork,
      artist: null,
      relatedWorks: [],
      prevArtwork: null,
      nextArtwork: null,
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
