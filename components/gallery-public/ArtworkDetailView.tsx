"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getArtistName, type ApiArtist, type ApiArtwork } from "@/lib/types/models";
import ArtworkLightbox from "@/components/gallery-public/ArtworkLightbox";
import RelatedWorks from "@/components/gallery-public/RelatedWorks";

interface ArtworkDetailViewProps {
  slug: string;
  artwork: ApiArtwork;
  artist: ApiArtist | null;
  relatedWorks: ApiArtwork[];
  prevArtwork: ApiArtwork | null;
  nextArtwork: ApiArtwork | null;
}

export default function ArtworkDetailView({
  slug,
  artwork,
  artist,
  relatedWorks,
  prevArtwork,
  nextArtwork,
}: ArtworkDetailViewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const price = artwork.price ? Number(artwork.price) : null;
  const artistName = getArtistName(artwork);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[color:var(--color-gallery-bg)]">
      <Link
        href={`/gallery/${slug}`}
        aria-label="Close"
        className="fixed top-6 right-6 z-50 text-[color:var(--color-gallery-fg)] transition-opacity hover:opacity-60"
      >
        <X size={28} strokeWidth={1.5} />
      </Link>

      {prevArtwork && (
        <Link
          href={`/gallery/${slug}/artwork/${prevArtwork.id}`}
          aria-label="Previous artwork"
          className="fixed top-1/2 left-2 z-50 -translate-y-1/2 rounded-full p-2 text-[color:var(--color-gallery-fg)] transition-opacity hover:opacity-60 sm:left-4"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </Link>
      )}
      {nextArtwork && (
        <Link
          href={`/gallery/${slug}/artwork/${nextArtwork.id}`}
          aria-label="Next artwork"
          className="fixed top-1/2 right-2 z-50 -translate-y-1/2 rounded-full p-2 text-[color:var(--color-gallery-fg)] transition-opacity hover:opacity-60 sm:right-4"
        >
          <ChevronRight size={32} strokeWidth={1.5} />
        </Link>
      )}

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-20 lg:flex-row-reverse lg:items-center lg:gap-16 lg:px-16">
        <div className="flex-1">
          {artwork.imageUrl ? (
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="relative block aspect-[3/4] w-full max-h-[80vh] cursor-zoom-in overflow-hidden bg-gray-100"
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-contain"
                priority
              />
            </button>
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="mt-10 w-full shrink-0 lg:mt-0 lg:w-80">
          <h1 className="font-serif text-3xl text-[color:var(--color-gallery-fg)]">
            {artistName.toUpperCase()}
          </h1>
          {artist && (artist.country || artist.birthYear) && (
            <p className="mt-1 text-xs tracking-[0.15em] text-[color:var(--color-gallery-fg)]/60 uppercase">
              {[artist.country, artist.birthYear ? `B. ${artist.birthYear}` : null]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}

          <div className="mt-8 space-y-2 text-sm tracking-wide text-[color:var(--color-gallery-fg)]/70 uppercase">
            <p>
              {artwork.title}
              {artwork.year ? `, ${artwork.year}` : ""}
            </p>
          </div>

          {artwork.description && (
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-gallery-fg)]/70 normal-case">
              {artwork.description}
            </p>
          )}

          {price !== null && (
            <p className="mt-4 text-sm text-[color:var(--color-gallery-fg)]/70">
              {price.toLocaleString(undefined, { style: "currency", currency: "USD" })}
            </p>
          )}

          <Link
            href={`/gallery/${slug}/contact`}
            className="mt-8 inline-block text-xs tracking-[0.2em] text-[color:var(--color-gallery-fg)] underline underline-offset-4 hover:opacity-60"
          >
            ENQUIRE
          </Link>
        </div>
      </div>

      {relatedWorks.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-16">
          <h2 className="font-serif text-xl text-[color:var(--color-gallery-fg)]">More by {artistName}</h2>
          <div className="mt-6">
            <RelatedWorks artworks={relatedWorks} slug={slug} />
          </div>
        </section>
      )}

      {isZoomed && artwork.imageUrl && (
        <ArtworkLightbox
          imageUrl={artwork.imageUrl}
          alt={artwork.title}
          onClose={() => setIsZoomed(false)}
        />
      )}
    </div>
  );
}
