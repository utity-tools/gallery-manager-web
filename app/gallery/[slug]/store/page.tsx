import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StoreGrid from "@/components/gallery-public/store/StoreGrid";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/lib/types/models";
import type { ApiProduct } from "@/lib/types/store";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getPublicProducts(slug: string): Promise<ApiProduct[] | null> {
  try {
    const res = await api.get<BackendEnvelope<PaginatedResponse<ApiProduct>>>(
      `/public/galleries/${slug}/store`,
      { params: { limit: 100 } }
    );
    return res.data.data?.items || [];
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Store | ${slug} | Gallery Manager` };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const products = await getPublicProducts(slug);

  if (products === null) {
    notFound();
  }

  return <StoreGrid slug={slug} products={products} />;
}
