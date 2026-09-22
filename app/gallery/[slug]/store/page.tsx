import type { Metadata } from "next";
import StoreGrid from "@/components/gallery-public/store/StoreGrid";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Store | ${slug} | Gallery Manager` };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;

  return <StoreGrid slug={slug} />;
}
