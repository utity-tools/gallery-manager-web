"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, MapPin, Menu, X } from "lucide-react";
import type { ApiGallery } from "@/lib/types/models";

interface NavbarProps {
  slug: string;
  gallery?: ApiGallery;
}

const links = (slug: string) => [
  { href: `/gallery/${slug}/artists`, label: "ARTISTS" },
  { href: `/gallery/${slug}/exhibitions`, label: "EXHIBITIONS" },
  { href: `/gallery/${slug}/store`, label: "STORE" },
  { href: `/gallery/${slug}/about`, label: "ABOUT" },
  { href: `/gallery/${slug}/contact`, label: "CONTACT" },
];

export default function Navbar({ slug, gallery }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hasTransparentHero =
    pathname === `/gallery/${slug}` ||
    pathname === `/gallery/${slug}/artists` ||
    pathname?.startsWith(`/gallery/${slug}/artist/`);

  useEffect(() => {
    if (!hasTransparentHero) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasTransparentHero]);

  const transparent = hasTransparentHero && !scrolled;
  const navLinks = links(slug);
  const textColor = transparent ? "text-white" : "text-[color:var(--color-gallery-fg)]";

  return (
    <header
      data-testid="gallery-navbar"
      data-transparent={transparent}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[color:var(--color-gallery-border)] bg-[color:var(--color-gallery-bg)]/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/gallery/${slug}`} className="flex-shrink-0">
          {gallery?.logoUrl ? (
            <div className="relative h-8 w-auto">
              <Image
                src={gallery.logoUrl}
                alt={gallery.title}
                height={32}
                width={160}
                className="h-8 w-auto"
                priority
              />
            </div>
          ) : (
            <span className={`font-serif text-lg leading-none font-semibold tracking-tight transition-colors duration-300 ${textColor}`}>
              {gallery?.title || "Gallery"}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs leading-none font-medium tracking-[0.15em] transition-opacity hover:opacity-60 ${textColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={`hidden items-center gap-5 transition-colors duration-300 md:flex ${textColor}`}>
          <button type="button" aria-label="Search" className="transition-opacity hover:opacity-60">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-60"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <Link href={`/gallery/${slug}/contact`} aria-label="Location" className="transition-opacity hover:opacity-60">
            <MapPin size={18} strokeWidth={1.5} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`transition-colors duration-300 md:hidden ${textColor}`}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className={`flex flex-col gap-1 border-t px-4 py-4 md:hidden ${
            transparent
              ? "border-white/20 bg-black/70 backdrop-blur"
              : "border-[color:var(--color-gallery-border)] bg-[color:var(--color-gallery-bg)]"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2 text-sm font-medium tracking-[0.1em] ${textColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
