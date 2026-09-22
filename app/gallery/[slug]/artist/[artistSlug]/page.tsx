import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistDetailView from "@/components/gallery-public/ArtistDetailView";
import { api } from "@/lib/api";
import type { ApiArtist, ArtistDetail } from "@/lib/types/models";

interface ArtistDetailPageProps {
  params: Promise<{ slug: string; artistSlug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * No public single-artist endpoint exists (by id or slug — both 404,
 * confirmed live). So: resolve the slug to an id via the public gallery
 * artists list, then fetch the full record from GET /api/artists/:id —
 * which, also confirmed live, works with no auth token at all despite not
 * living under /public/.
 */
async function getPublicArtist(slug: string, artistSlug: string): Promise<ArtistDetail | null> {
  try {
    const listRes = await api.get<BackendEnvelope<ApiArtist[]>>(
      `/public/galleries/${slug}/artists`
    );
    const match = listRes.data.data.find((a) => a.slug === artistSlug);
    if (!match) return null;

    const detailRes = await api.get<BackendEnvelope<ArtistDetail>>(`/artists/${match.id}`);
    return detailRes.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  const { slug, artistSlug } = await params;
  const artist = await getPublicArtist(slug, artistSlug);
  if (!artist) return { title: "Artist | Gallery Manager" };
  return {
    title: `${artist.name} | Gallery Manager`,
    description: artist.biographyText?.slice(0, 160) ?? artist.bio?.slice(0, 160),
  };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { slug, artistSlug } = await params;
  const artist = await getPublicArtist(slug, artistSlug);

  if (!artist) {
    notFound();
  }

  return <ArtistDetailView slug={slug} artist={artist} />;
}
