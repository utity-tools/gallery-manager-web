import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StoreManager from "@/components/dashboard/store/StoreManager";

export const metadata: Metadata = {
  title: "Store | Gallery Manager",
};

export default async function StorePage() {
  const session = await getServerSession(authOptions);

  return <StoreManager slug={session?.user?.slug ?? ""} />;
}

