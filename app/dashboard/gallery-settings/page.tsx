import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GallerySettingsManager from "@/components/dashboard/GallerySettingsManager";

export const metadata: Metadata = {
  title: "Gallery Settings | Gallery Manager",
};

export default async function GallerySettingsPage() {
  const session = await getServerSession(authOptions);

  return <GallerySettingsManager slug={session?.user?.slug ?? ""} />;
}
