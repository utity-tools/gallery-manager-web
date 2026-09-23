"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Settings,
  Eye,
  SlidersHorizontal,
  LogOut,
  Users,
  Calendar,
  ShoppingBag,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface SidebarProps {
  userName: string;
  userEmail: string;
  slug: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  userName,
  userEmail,
  slug,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout, isLoading: isLoggingOut } = useLogout();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/artworks", label: "Artworks", icon: ImageIcon },
    { href: "/dashboard/artists", label: "Artists", icon: Users },
    { href: "/dashboard/shows", label: "Exhibitions", icon: Calendar },
    { href: "/dashboard/store", label: "Store", icon: ShoppingBag },
    { href: "/dashboard/gallery-settings", label: "Gallery Settings", icon: SlidersHorizontal },
    { href: `/gallery/${slug}`, label: "Public Preview", icon: Eye, external: true },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`flex h-full flex-col bg-[color:var(--color-dashboard-sidebar)] transition-[width] duration-200 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div className={`flex items-center gap-2 px-3 py-6 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <span className="truncate text-sm font-semibold tracking-wide text-gray-900">
            Gallery Manager
          </span>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="shrink-0 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((link) => {
          const isActive = !link.external && pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              title={isCollapsed ? link.label : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isCollapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-accent-50 text-accent-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 px-3 py-4">
        {!isCollapsed && (
          <div className="px-1">
            <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          title={isCollapsed ? (isLoggingOut ? "Logging out..." : "Log out") : undefined}
          className="btn-danger mt-3 flex w-full items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut size={16} strokeWidth={1.75} className="shrink-0" />
          {!isCollapsed && (isLoggingOut ? "Logging out..." : "Log out")}
        </button>
      </div>
    </div>
  );
}
