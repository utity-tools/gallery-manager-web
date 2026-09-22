import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ArtistsClient from "@/components/dashboard/artists/ArtistsClient";

export const metadata: Metadata = {
  title: "Artists | Gallery Manager",
};

export default async function ArtistsPage() {
  const session = await getServerSession(authOptions);

  return <ArtistsClient slug={session?.user?.slug ?? ""} />;
}
