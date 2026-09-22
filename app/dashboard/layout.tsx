import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardLayout
      userName={session.user?.name ?? "there"}
      userEmail={session.user?.email ?? ""}
      slug={session.user?.slug ?? ""}
    >
      {children}
    </DashboardLayout>
  );
}
