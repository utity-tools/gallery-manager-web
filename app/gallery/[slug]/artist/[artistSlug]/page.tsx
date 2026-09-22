import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistDetailView from "@/components/gallery-public/ArtistDetailView";
import { api } from "@/lib/api";
import type { ArtistDetail } from "@/lib/types/models";

interface ArtistDetailPageProps {
  params: Promise<{ slug: string; artistSlug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicArtist(slug: string, artistSlug: string): Promise<ArtistDetail | null> {
  try {
    const res = await api.get<BackendEnvelope<ArtistDetail>>(
      `/public/galleries/${slug}/artists/${artistSlug}`
    );
    return res.data.data;
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
