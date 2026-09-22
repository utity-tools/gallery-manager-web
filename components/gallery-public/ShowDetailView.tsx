import Image from "next/image";
import Link from "next/link";
import type { ShowDetail } from "@/lib/types/models";

interface ShowDetailViewProps {
  slug: string;
  show: ShowDetail;
}

function formatDateRange(startDate?: string, endDate?: string): string | null {
  if (!startDate && !endDate) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  if (startDate && endDate) return `${fmt(startDate)} — ${fmt(endDate)}`;
  return fmt((startDate ?? endDate) as string);
}

export default function ShowDetailView({ slug, show }: ShowDetailViewProps) {
  const coverImageUrl = show.coverImageUrl || show.artworks[0]?.imageUrl;
  const dateRange = formatDateRange(show.startDate, show.endDate);
  const venueLine = [show.venueName, show.address, show.city, show.country].filter(Boolean).join(", ");

  return (
    <div data-testid="show-detail-page">
      <div className="relative h-[50vh] min-h-[360px] w-full bg-gray-800">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={show.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center">
          <h1 className="font-serif text-3xl text-white drop-shadow-sm md:text-4xl">{show.title}</h1>
          {dateRange && <p className="mt-2 text-sm tracking-[0.1em] text-white/85">{dateRange}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {venueLine && (
          <p className="text-sm tracking-wide text-[color:var(--color-gallery-fg)]/60">{venueLine}</p>
        )}

        {show.description && (
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-[color:var(--color-gallery-fg)]/80">
            {show.description}
          </p>
        )}

        {show.artists.length > 0 && (
          <div className="mt-10">
            <p className="text-xs tracking-[0.15em] text-[color:var(--color-gallery-fg)]/40 uppercase">
              Artists
            </p>
            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
              {show.artists.map((artist, i) => (
                <span key={artist.id}>
                  <Link
                    href={`/gallery/${slug}/artist/${artist.slug}`}
                    className="font-serif text-lg text-[color:var(--color-gallery-fg)] hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {i < show.artists.length - 1 && <span className="text-[color:var(--color-gallery-fg)]/40">, </span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {show.artworks.length > 0 && (
        <section className="mx-auto max-w-7xl border-t border-[color:var(--color-gallery-border)] px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-[color:var(--color-gallery-fg)]">Works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {show.artworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/gallery/${slug}/artwork/${artwork.id}`}
                data-testid={`show-artwork-card-${artwork.id}`}
                className="group block"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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
                <p className="mt-3 truncate font-serif text-base text-[color:var(--color-gallery-fg)]">
                  {artwork.title}
                </p>
                <p className="text-xs tracking-wide text-[color:var(--color-gallery-fg)]/60">
                  {artwork.artist?.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
