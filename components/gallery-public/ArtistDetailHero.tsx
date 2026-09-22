"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  url: string;
  title: string;
}

interface ArtistDetailHeroProps {
  slug: string;
  artistName: string;
  country?: string;
  birthYear?: number;
  slides: HeroSlide[];
}

const tabs = [
  { key: "biography", label: "BIOGRAPHY", href: "#biography" },
  { key: "works", label: "WORKS", href: "#works" },
  { key: "exhibitions", label: "EXHIBITIONS", href: "#exhibitions" },
  { key: "art-fairs", label: "ART FAIRS", href: "#art-fairs" },
  { key: "cv", label: "CV", href: "#cv" },
];

export default function ArtistDetailHero({
  slug,
  artistName,
  country,
  birthYear,
  slides,
}: ArtistDetailHeroProps) {
  const [index, setIndex] = useState(0);
  const hasSlides = slides.length > 0;
  const current = hasSlides ? slides[index] : null;

  const goPrev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div data-testid="artist-hero" className="relative -mt-16 h-screen w-full bg-gray-800">
      {current ? (
        <Image
          key={current.url}
          data-testid="artist-hero-image"
          src={current.url}
          alt={current.title || artistName}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />

      <div className="relative h-full px-6 pt-28 pb-10 sm:px-10 lg:px-16">
        <div>
          <h1
            data-testid="artist-name"
            className="font-serif text-3xl text-white drop-shadow-sm md:text-4xl"
          >
            {artistName.toUpperCase()}
          </h1>
          {(country || birthYear) && (
            <p className="mt-1 text-xs tracking-[0.15em] text-white/80 uppercase">
              {[country, birthYear ? `B. ${birthYear}` : null].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        <nav
          data-testid="artist-hero-tabs"
          className="absolute top-1/2 left-6 flex -translate-y-1/2 flex-col gap-3 sm:left-10 lg:left-16"
        >
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={tab.href}
              data-testid={`artist-hero-tab-${tab.key}`}
              className="w-fit text-xs tracking-[0.15em] text-white/90 transition-opacity hover:opacity-60"
            >
              {tab.label}
            </a>
          ))}
          <Link
            href={`/gallery/${slug}/contact`}
            data-testid="artist-hero-tab-enquire"
            className="w-fit text-xs tracking-[0.15em] text-white/90 transition-opacity hover:opacity-60"
          >
            ENQUIRE
          </Link>
        </nav>

        {hasSlides && (
          <div className="absolute right-6 bottom-10 left-6 flex items-end justify-between text-white sm:right-10 sm:left-10 lg:right-16 lg:left-16">
            <div data-testid="artist-hero-counter" className="flex items-center gap-3 text-xs tracking-[0.1em]">
              <span>
                {index + 1}/{slides.length}
              </span>
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    data-testid="artist-hero-prev"
                    onClick={goPrev}
                    className="uppercase transition-opacity hover:opacity-60"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    data-testid="artist-hero-next"
                    onClick={goNext}
                    className="uppercase transition-opacity hover:opacity-60"
                  >
                    Next
                  </button>
                </>
              )}
            </div>

            {current?.title && (
              <p data-testid="artist-hero-caption" className="text-xs tracking-[0.1em] text-white/90">
                {current.title}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
