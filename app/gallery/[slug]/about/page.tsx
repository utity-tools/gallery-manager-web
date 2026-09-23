import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutPageView from "@/components/gallery-public/AboutPageView";
import { api } from "@/lib/api";
import type { ApiArtwork, ApiGallery, ArtworksPage } from "@/lib/types/models";

interface AboutPageProps {
  params: Promise<{ slug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicGallery(
  slug: string
): Promise<{ gallery: ApiGallery; featuredArtwork: ApiArtwork | null } | null> {
  try {
    const [galleryRes, artworksRes] = await Promise.all([
      api.get<BackendEnvelope<ApiGallery>>(`/public/galleries/${slug}`),
      api.get<BackendEnvelope<ArtworksPage>>(`/public/galleries/${slug}/artworks`, {
        params: { limit: 1 },
      }),
    ]);
    return {
      gallery: galleryRes.data.data,
      featuredArtwork: artworksRes.data.data.items[0] ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicGallery(slug);
  if (!result) {
    return { title: "About | Gallery Manager" };
  }
  return {
    title: `About ${result.gallery.title} | Gallery Manager`,
    description: result.gallery.aboutText?.slice(0, 160) || result.gallery.description || undefined,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { slug } = await params;
  const result = await getPublicGallery(slug);

  if (!result) {
    notFound();
  }

  return (
    <AboutPageView slug={slug} gallery={result.gallery} featuredArtwork={result.featuredArtwork} />
  );
}
