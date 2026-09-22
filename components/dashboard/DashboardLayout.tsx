"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  userName: string;
  userEmail: string;
  slug: string;
  children: React.ReactNode;
}

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/artworks": "Artworks",
  "/dashboard/artists": "Artists",
  "/dashboard/shows": "Exhibitions",
  "/dashboard/gallery-settings": "Gallery Settings",
  "/dashboard/settings": "Settings",
};

const COLLAPSE_STORAGE_KEY = "gallery-manager:sidebar-collapsed";

export default function DashboardLayout({
  userName,
  userEmail,
  slug,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  useEffect(() => {
    try {
      setIsCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true");
    } catch {
      // localStorage unavailable (private mode, etc.) — default to expanded.
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      } catch {
        // ignore write failures
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[color:var(--color-dashboard-bg)]">
      <div className="sticky top-0 hidden h-screen shrink-0 border-r border-gray-200 md:block">
        <Sidebar
          userName={userName}
          userEmail={userEmail}
          slug={slug}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-screen border-r border-gray-200">
            <Sidebar
              userName={userName}
              userEmail={userEmail}
              slug={slug}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="text-gray-600 md:hidden"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
