import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/gallery-public/store/ProductDetail";
import { api } from "@/lib/api";
import type { ApiProduct } from "@/lib/types/store";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

async function getProduct(slug: string, productId: string): Promise<ApiProduct | null> {
  try {
    const res = await api.get<BackendEnvelope<ApiProduct>>(
      `/public/galleries/${slug}/store/${productId}`
    );
    return res.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug, productId } = await params;
  const product = await getProduct(slug, productId);
  if (!product) return { title: `Product | ${slug} | Gallery Manager` };
  return { title: `${product.title} | ${slug} | Gallery Manager` };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug, productId } = await params;
  const product = await getProduct(slug, productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail slug={slug} product={product} />;
}
