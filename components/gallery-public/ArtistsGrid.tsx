"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiArtist } from "@/lib/types/models";

interface ArtistsGridProps {
  artists: ApiArtist[];
  slug: string;
  backgroundImageUrl?: string | null;
}

export default function ArtistsGrid({ artists, slug, backgroundImageUrl }: ArtistsGridProps) {
  const sorted = [...artists].sort((a, b) => a.name.localeCompare(b.name));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);

  const hoveredArtist = sorted.find((a) => a.id === hoveredId);
  const showOverlay = Boolean(hoveredArtist?.photoUrl);

  useEffect(() => {
    if (hoveredArtist?.photoUrl) setLastPhotoUrl(hoveredArtist.photoUrl);
  }, [hoveredArtist?.photoUrl]);

  return (
    <div data-testid="artists-page" className="relative -mt-16 h-screen w-full overflow-hidden bg-gray-900">
      {backgroundImageUrl && (
        <Image
          src={backgroundImageUrl}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-50 blur-md"
        />
      )}

      {lastPhotoUrl && (
        <Image
          data-testid="artists-hover-image"
          src={lastPhotoUrl}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${showOverlay ? "opacity-80" : "opacity-0"}`}
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 pt-16 sm:px-10 lg:px-16">
        {sorted.length === 0 ? (
          <p className="w-full text-center text-sm text-white/60">No artists to display yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((artist) => (
              <Link
                key={artist.id}
                href={`/gallery/${slug}/artist/${artist.slug}`}
                data-testid={`artist-list-item-${artist.id}`}
                onMouseEnter={() => setHoveredId(artist.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="text-sm tracking-[0.1em] text-white/90 transition-opacity hover:opacity-60"
              >
                {artist.name.toUpperCase()}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
