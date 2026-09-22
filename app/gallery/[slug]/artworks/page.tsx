import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtworksGrid from "@/components/gallery-public/ArtworksGrid";
import { api } from "@/lib/api";
import type { ArtworksPage } from "@/lib/types/models";

interface ArtworksPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicArtworksPageData(
  slug: string,
  page: number = 1
): Promise<ArtworksPage | null> {
  try {
    const res = await api.get<BackendEnvelope<ArtworksPage>>(
      `/public/galleries/${slug}/artworks`,
      {
        params: { page, limit: 12, sortBy: "createdAt", order: "desc" },
      }
    );
    return res.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ArtworksPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Artworks | ${slug} | Gallery Manager` };
}

export default async function ArtworksPage({ params, searchParams }: ArtworksPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const result = await getPublicArtworksPageData(slug, currentPage);

  if (!result) {
    notFound();
  }

  return <ArtworksGrid artworks={result.artworks} slug={slug} pagination={result} />;
}
