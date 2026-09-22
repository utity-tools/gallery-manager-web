import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard | Gallery Manager",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return <DashboardOverview slug={session?.user?.slug ?? ""} />;
}
