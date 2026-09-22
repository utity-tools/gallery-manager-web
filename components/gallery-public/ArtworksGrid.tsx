"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getArtistName, type ApiArtwork, type ArtworksPage } from "@/lib/types/models";

interface ArtworksGridProps {
  artworks: ApiArtwork[];
  slug: string;
  pagination: ArtworksPage;
}

export default function ArtworksGrid({ artworks, slug, pagination }: ArtworksGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedArtwork = artworks.find((a) => a.id === selectedId);

  return (
    <div data-testid="artworks-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">ARTWORKS</h1>
        <p className="mt-2 text-sm text-[color:var(--color-gallery-fg)]/60">
          {pagination.total} work{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      {artworks.length === 0 ? (
        <p className="text-center text-sm text-[color:var(--color-gallery-fg)]/50">No artworks to display yet.</p>
      ) : (
        <>
          <div className="grid auto-rows-[300px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                data-testid={`artwork-card-${artwork.id}`}
                className="group relative overflow-hidden rounded-lg bg-gray-100"
              >
                <Link
                  href={`/gallery/${slug}/artwork/${artwork.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedId(artwork.id);
                  }}
                  className="relative block h-full w-full"
                >
                  {artwork.imageUrl && (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-black/0 p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-xs font-semibold text-white">{artwork.title.toUpperCase()}</p>
                    <p className="mt-1 text-xs text-white/70">{getArtistName(artwork)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-between gap-4 border-t border-gray-200 pt-8">
              <Link
                href={pagination.page > 1 ? `/gallery/${slug}/artworks?page=${pagination.page - 1}` : "#"}
                className={`text-sm font-medium transition-opacity ${
                  pagination.page > 1
                    ? "text-[color:var(--color-gallery-fg)] hover:opacity-70"
                    : "cursor-not-allowed text-[color:var(--color-gallery-fg)]/30"
                }`}
              >
                ← PREVIOUS
              </Link>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <Link
                    key={i + 1}
                    href={i + 1 === 1 ? `/gallery/${slug}/artworks` : `/gallery/${slug}/artworks?page=${i + 1}`}
                    className={`text-xs font-semibold transition-opacity ${
                      pagination.page === i + 1
                        ? "text-[color:var(--color-gallery-fg)]"
                        : "text-[color:var(--color-gallery-fg)]/50 hover:text-[color:var(--color-gallery-fg)]"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>

              <Link
                href={
                  pagination.page < pagination.pages ? `/gallery/${slug}/artworks?page=${pagination.page + 1}` : "#"
                }
                className={`text-sm font-medium transition-opacity ${
                  pagination.page < pagination.pages
                    ? "text-[color:var(--color-gallery-fg)] hover:opacity-70"
                    : "cursor-not-allowed text-[color:var(--color-gallery-fg)]/30"
                }`}
              >
                NEXT →
              </Link>
            </div>
          )}

          {selectedArtwork && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="relative max-h-[90vh] max-w-4xl">
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute -right-10 -top-10 text-white hover:opacity-70"
                  aria-label="Close"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {selectedArtwork.imageUrl && (
                  <Image
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    width={800}
                    height={600}
                    className="object-contain"
                  />
                )}

                <div className="mt-4 text-white">
                  <h2 className="text-lg font-semibold">{selectedArtwork.title}</h2>
                  <p className="mt-1 text-sm text-white/70">{getArtistName(selectedArtwork)}</p>
                  <Link
                    href={`/gallery/${slug}/artwork/${selectedArtwork.id}`}
                    className="mt-3 inline-block text-xs font-semibold text-white hover:opacity-70"
                  >
                    VIEW DETAILS →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
