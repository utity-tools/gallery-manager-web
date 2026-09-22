import Image from "next/image";
import Link from "next/link";
import type { ApiShow } from "@/lib/types/models";

interface ExhibitionsListViewProps {
  slug: string;
  shows: ApiShow[];
}

function formatDateRange(startDate?: string, endDate?: string): string | null {
  if (!startDate && !endDate) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  if (startDate && endDate) return `${fmt(startDate)} — ${fmt(endDate)}`;
  return fmt((startDate ?? endDate) as string);
}

function ShowCard({ show, slug }: { show: ApiShow; slug: string }) {
  return (
    <Link
      href={`/gallery/${slug}/exhibitions/${show.slug}`}
      data-testid={`show-card-${show.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {show.coverImageUrl ? (
          <Image
            src={show.coverImageUrl}
            alt={show.title}
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
      <p className="mt-4 font-serif text-xl text-[color:var(--color-gallery-fg)]">{show.title}</p>
      {formatDateRange(show.startDate, show.endDate) && (
        <p className="mt-1 text-sm text-[color:var(--color-gallery-fg)]/60">
          {formatDateRange(show.startDate, show.endDate)}
        </p>
      )}
      {(show.venueName || show.city) && (
        <p className="text-xs tracking-wide text-[color:var(--color-gallery-fg)]/50 uppercase">
          {[show.venueName, show.city].filter(Boolean).join(", ")}
        </p>
      )}
    </Link>
  );
}

export default function ExhibitionsListView({ slug, shows }: ExhibitionsListViewProps) {
  const current = shows.filter((s) => s.status === "current");
  const upcoming = shows.filter((s) => s.status === "upcoming");
  const past = shows.filter((s) => s.status === "past" || s.status === null);

  const groups = [
    { label: "Current", items: current },
    { label: "Upcoming", items: upcoming },
    { label: "Past", items: past },
  ].filter((g) => g.items.length > 0);

  return (
    <div data-testid="exhibitions-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-[color:var(--color-gallery-fg)] md:text-4xl">
        Exhibitions
      </h1>

      {groups.length === 0 ? (
        <p className="mt-8 text-sm text-[color:var(--color-gallery-fg)]/50">
          No exhibitions to display yet.
        </p>
      ) : (
        <div className="mt-12 space-y-16">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="text-xs tracking-[0.15em] text-[color:var(--color-gallery-fg)]/40 uppercase">
                {group.label}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((show) => (
                  <ShowCard key={show.id} show={show} slug={slug} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
