import type { Metadata } from "next";
import ProductDetail from "@/components/gallery-public/store/ProductDetail";

interface ProductDetailPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Product | ${slug} | Gallery Manager` };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug, productId } = await params;

  return <ProductDetail slug={slug} productId={productId} />;
}
