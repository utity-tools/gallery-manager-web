import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <MarketingHeader isAuthenticated={Boolean(session)} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
