import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeHero from "@/components/gallery-public/HomeHero";
import { api } from "@/lib/api";
import type { ApiArtwork, ApiGallery, ArtworksPage } from "@/lib/types/models";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicGallery(
  slug: string
): Promise<{ gallery: ApiGallery; artworks: ApiArtwork[] } | null> {
  try {
    const [galleryRes, artworksRes] = await Promise.all([
      api.get<BackendEnvelope<ApiGallery>>(`/public/galleries/${slug}`),
      api.get<BackendEnvelope<ArtworksPage>>(`/public/galleries/${slug}/artworks`, {
        params: { limit: 50 },
      }),
    ]);
    return {
      gallery: galleryRes.data.data,
      artworks: artworksRes.data.data.items,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} | Gallery Manager` };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const result = await getPublicGallery(slug);

  if (!result) {
    notFound();
  }

  const { gallery, artworks } = result;

  return (
    <div>
      <HomeHero galleryTitle={gallery.title} artworks={artworks} gallery={gallery} />
    </div>
  );
}
