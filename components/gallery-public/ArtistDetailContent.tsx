import Image from "next/image";
import Link from "next/link";
import type { ArtistDetail } from "@/lib/types/models";

interface ArtistDetailContentProps {
  artist: ArtistDetail;
  slug: string;
}

export default function ArtistDetailContent({ artist, slug }: ArtistDetailContentProps) {
  const hasBiography = Boolean(artist.biographyHeading || artist.biographyText || artist.biographyPhotoUrl);
  const featuredArtworks = artist.featuredArtworks ?? [];
  const exhibitions = artist.exhibitions ?? [];
  const artFairs = artist.artFairs ?? [];

  return (
    <>
      <section
        id="biography"
        data-testid="biography-section"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8"
      >
        <p className="text-xs tracking-[0.15em] text-[color:var(--color-gallery-fg)]/40">BIOGRAPHY</p>

        {!hasBiography ? (
          <p className="mt-6 text-sm text-[color:var(--color-gallery-fg)]/50">
            This artist hasn&apos;t added a biography yet.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              {artist.biographyHeading && (
                <h2
                  data-testid="biography-heading"
                  className="border-l-2 border-[color:var(--color-gallery-border)] pl-6 font-serif text-2xl leading-snug text-[color:var(--color-gallery-fg)] md:text-3xl"
                >
                  {artist.biographyHeading}
                </h2>
              )}
              {artist.biographyText && (
                <div data-testid="biography-text" className="mt-10 max-w-[65ch] space-y-6">
                  {artist.biographyText.split("\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-[color:var(--color-gallery-fg)]/80 md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {artist.biographyPhotoUrl && (
              <div
                data-testid="biography-photo-side"
                className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100"
              >
                <Image
                  src={artist.biographyPhotoUrl}
                  alt={artist.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}
      </section>

      <section
        id="works"
        data-testid="artworks-grid"
        className="mx-auto max-w-7xl scroll-mt-24 border-t border-[color:var(--color-gallery-border)] px-4 py-8 sm:px-6 lg:px-8"
      >
        <h2 className="font-serif text-2xl text-[color:var(--color-gallery-fg)]">Works</h2>
        <div className="mt-8">
          {featuredArtworks.length === 0 ? (
            <p className="text-sm text-[color:var(--color-gallery-fg)]/50">No artworks featured yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArtworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/gallery/${slug}/artwork/${artwork.id}`}
                  data-testid={`artwork-card-${artwork.id}`}
                  className="group block"
                >
                  <div
                    data-testid={`artwork-image-${artwork.id}`}
                    className="relative aspect-square w-full overflow-hidden bg-gray-100"
                  >
                    {artwork.imageUrl ? (
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--color-gallery-fg)]/40">
                        No image
                      </div>
                    )}
                  </div>
                  <p
                    data-testid={`artwork-title-${artwork.id}`}
                    className="mt-3 truncate font-serif text-base text-[color:var(--color-gallery-fg)]"
                  >
                    {artwork.title}
                  </p>
                  {artwork.year && (
                    <p
                      data-testid={`artwork-year-${artwork.id}`}
                      className="text-xs tracking-wide text-[color:var(--color-gallery-fg)]/60"
                    >
                      {artwork.year}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="exhibitions"
        data-testid="exhibitions-section"
        className="mx-auto max-w-5xl scroll-mt-24 border-t border-[color:var(--color-gallery-border)] px-4 py-8 sm:px-6 lg:px-8"
      >
        <h2 className="font-serif text-2xl text-[color:var(--color-gallery-fg)]">Exhibitions</h2>
        <div className="mt-8">
          {exhibitions.length === 0 ? (
            <p className="text-sm text-[color:var(--color-gallery-fg)]/50">No exhibitions listed yet.</p>
          ) : (
            <ul className="space-y-3">
              {exhibitions.map((exhibition) => (
                <li
                  key={exhibition.id}
                  data-testid={`exhibition-${exhibition.id}`}
                  className="text-sm text-[color:var(--color-gallery-fg)]/80 md:text-base"
                >
                  {[exhibition.year, exhibition.title, exhibition.venue, exhibition.country]
                    .filter(Boolean)
                    .join(" — ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        id="art-fairs"
        data-testid="art-fairs-section"
        className="mx-auto max-w-5xl scroll-mt-24 border-t border-[color:var(--color-gallery-border)] px-4 py-8 sm:px-6 lg:px-8"
      >
        <h2 className="font-serif text-2xl text-[color:var(--color-gallery-fg)]">Art Fairs</h2>
        <div className="mt-8">
          {artFairs.length === 0 ? (
            <p className="text-sm text-[color:var(--color-gallery-fg)]/50">No art fairs listed yet.</p>
          ) : (
            <ul className="space-y-3">
              {artFairs.map((artFair) => (
                <li
                  key={artFair.id}
                  data-testid={`art-fair-${artFair.id}`}
                  className="text-sm text-[color:var(--color-gallery-fg)]/80 md:text-base"
                >
                  {[artFair.year, artFair.name, artFair.country].filter(Boolean).join(" — ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        id="cv"
        data-testid="cv-section"
        className="mx-auto max-w-5xl scroll-mt-24 border-t border-[color:var(--color-gallery-border)] px-4 py-8 sm:px-6 lg:px-8"
      >
        <h2 className="font-serif text-2xl text-[color:var(--color-gallery-fg)]">CV</h2>
        <div className="mt-8">
          {!artist.cv ? (
            <p className="text-sm text-[color:var(--color-gallery-fg)]/50">No CV added yet.</p>
          ) : (
            <div data-testid="cv-text" className="max-w-[65ch]">
              {artist.cv.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-4" />
                ) : (
                  <p key={i} className="text-sm leading-relaxed text-[color:var(--color-gallery-fg)]/80 md:text-base">
                    {line}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
