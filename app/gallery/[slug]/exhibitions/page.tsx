import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExhibitionsListView from "@/components/gallery-public/ExhibitionsListView";
import { api } from "@/lib/api";
import type { ApiShow } from "@/lib/types/models";

interface ExhibitionsPageProps {
  params: Promise<{ slug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicShows(slug: string): Promise<ApiShow[] | null> {
  try {
    const { data } = await api.get<BackendEnvelope<ApiShow[]>>(
      `/public/galleries/${slug}/shows`
    );
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ExhibitionsPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Exhibitions | ${slug} | Gallery Manager` };
}

export default async function ExhibitionsPage({ params }: ExhibitionsPageProps) {
  const { slug } = await params;
  const shows = await getPublicShows(slug);

  if (!shows) {
    notFound();
  }

  return <ExhibitionsListView slug={slug} shows={shows} />;
}
