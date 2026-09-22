import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShowDetailView from "@/components/gallery-public/ShowDetailView";
import { api } from "@/lib/api";
import type { ApiShow, ShowDetail } from "@/lib/types/models";

interface ShowDetailPageProps {
  params: Promise<{ slug: string; showSlug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * No public "by slug" endpoint exists — resolve the slug to an id via the
 * public shows list (which carries slugs), then fetch the full detail from
 * GET /api/shows/:id, which is public per the backend's documented contract.
 */
async function getPublicShow(slug: string, showSlug: string): Promise<ShowDetail | null> {
  try {
    const listRes = await api.get<BackendEnvelope<ApiShow[]>>(
      `/public/galleries/${slug}/shows`
    );
    const match = listRes.data.data.find((s) => s.slug === showSlug);
    if (!match) return null;

    const detailRes = await api.get<BackendEnvelope<ShowDetail>>(`/shows/${match.id}`);
    return detailRes.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ShowDetailPageProps): Promise<Metadata> {
  const { slug, showSlug } = await params;
  const show = await getPublicShow(slug, showSlug);
  if (!show) return { title: "Exhibition | Gallery Manager" };
  return {
    title: `${show.title} | Gallery Manager`,
    description: show.description?.slice(0, 160),
  };
}

export default async function ShowDetailPage({ params }: ShowDetailPageProps) {
  const { slug, showSlug } = await params;
  const show = await getPublicShow(slug, showSlug);

  if (!show) {
    notFound();
  }

  return <ShowDetailView slug={slug} show={show} />;
}
