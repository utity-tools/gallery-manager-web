"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getArtistName, type ApiArtwork, type ApiGallery } from "@/lib/types/models";

interface HomeHeroProps {
  galleryTitle: string;
  artworks: ApiArtwork[];
  gallery?: ApiGallery;
}

const SLIDE_DURATION_MS = 6000;

export default function HomeHero({ galleryTitle, artworks, gallery }: HomeHeroProps) {
  const getSlides = () => {
    // If carousel is configured, use those artworks
    if (gallery?.heroArtworkIds && gallery.heroArtworkIds.length > 0) {
      const heroArtworks = gallery.heroArtworkIds
        .map((id) => artworks.find((a) => a.id === id))
        .filter((a) => a && a.imageUrl) as ApiArtwork[];
      if (heroArtworks.length > 0) return heroArtworks;
    }
    // Fallback: show first artwork if carousel not configured (deterministic, no hydration mismatch)
    const available = artworks.filter((a) => a.imageUrl);
    if (available.length === 0) return [];
    return [available[0]];
  };

  const slides = getSlides();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="-mt-16 flex h-screen w-full flex-col items-center justify-center bg-[color:var(--color-gallery-fg)] text-center text-[color:var(--color-gallery-bg)]">
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{galleryTitle}</h1>
        <p className="mt-3 text-sm tracking-widest opacity-70">NO ARTWORKS PUBLISHED YET</p>
      </div>
    );
  }

  const current = slides[index];
  const goPrev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div data-testid="home-hero" className="relative -mt-16 h-screen w-full overflow-hidden bg-gray-800">
      {slides.map((artwork, i) => (
        <div
          key={artwork.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={artwork.imageUrl as string}
            alt={artwork.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />

      <div className="absolute right-6 bottom-10 left-6 flex items-end justify-between text-white sm:right-10 sm:left-10 lg:right-16 lg:left-16">
        <div data-testid="home-hero-counter" className="flex items-center gap-3 text-xs tracking-[0.1em]">
          <span>
            {index + 1}/{slides.length}
          </span>
          {slides.length > 1 && (
            <>
              <button
                type="button"
                data-testid="home-hero-prev"
                onClick={goPrev}
                className="uppercase transition-opacity hover:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                data-testid="home-hero-next"
                onClick={goNext}
                className="uppercase transition-opacity hover:opacity-60"
              >
                Next
              </button>
            </>
          )}
        </div>

        <div className="text-right">
          <h1 data-testid="home-hero-caption" className="font-serif text-2xl text-white drop-shadow-sm sm:text-3xl">
            {getArtistName(current).toUpperCase()} : {current.title}
          </h1>
          {current.year && (
            <p className="mt-1 text-xs tracking-[0.15em] text-white/80">{current.year}</p>
          )}
        </div>
      </div>
    </div>
  );
}
