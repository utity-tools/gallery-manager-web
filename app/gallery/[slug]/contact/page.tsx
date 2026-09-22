import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPageView from "@/components/gallery-public/ContactPageView";
import { api } from "@/lib/api";
import type { ApiArtwork, ApiGallery, ArtworksPage } from "@/lib/types/models";

interface ContactPageProps {
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
      featuredArtwork: artworksRes.data.data.artworks[0] ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicGallery(slug);
  return { title: result ? `Contact ${result.gallery.title} | Gallery Manager` : "Contact | Gallery Manager" };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { slug } = await params;
  const result = await getPublicGallery(slug);

  if (!result) {
    notFound();
  }

  return (
    <ContactPageView slug={slug} gallery={result.gallery} featuredArtwork={result.featuredArtwork} />
  );
}
