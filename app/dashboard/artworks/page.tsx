import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ArtworksClient from "@/components/dashboard/artworks/ArtworksClient";

export const metadata: Metadata = {
  title: "Artworks | Gallery Manager",
};

export default async function ArtworksPage() {
  const session = await getServerSession(authOptions);

  return <ArtworksClient slug={session?.user?.slug ?? ""} />;
}
