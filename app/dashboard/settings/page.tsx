import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Settings | Gallery Manager",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="card max-w-md">
      <h2 className="text-lg font-medium text-gray-900">Account</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-gray-500">Name</dt>
          <dd className="text-gray-900">{session?.user?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-900">{session?.user?.email ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
