import { Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import Navbar from "@/components/gallery-public/Navbar";
import Footer from "@/components/gallery-public/Footer";
import { api } from "@/lib/api";
import type { ApiGallery } from "@/lib/types/models";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

interface BackendEnvelope<T> {
  success: boolean;
  data: T;
}

interface GalleryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function getPublicGallery(slug: string): Promise<ApiGallery | null> {
  try {
    const { data } = await api.get<BackendEnvelope<ApiGallery>>(`/public/galleries/${slug}`);
    return data.data;
  } catch {
    return null;
  }
}

export default async function GalleryLayout({ children, params }: GalleryLayoutProps) {
  const { slug } = await params;
  const gallery = await getPublicGallery(slug);

  if (!gallery) {
    notFound();
  }

  return (
    <div
      className={`${playfair.variable} flex min-h-screen flex-col bg-[color:var(--color-gallery-bg)]`}
    >
      <Navbar slug={slug} gallery={gallery} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer gallery={gallery} />
    </div>
  );
}
