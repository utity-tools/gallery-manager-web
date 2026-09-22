import Image from "next/image";
import AboutContactNav from "@/components/gallery-public/AboutContactNav";
import { getArtistName, type ApiArtwork, type ApiGallery } from "@/lib/types/models";

interface AboutPageViewProps {
  slug: string;
  gallery: ApiGallery;
  featuredArtwork: ApiArtwork | null;
}

export default function AboutPageView({ slug, gallery, featuredArtwork }: AboutPageViewProps) {
  const hasAbout = gallery.aboutHeading || gallery.aboutText;
  const paragraphs = (gallery.aboutText ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div data-testid="about-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div>
          <h1 className="font-serif text-xl tracking-wide text-[color:var(--color-gallery-fg)]">
            {gallery.aboutHeading?.toUpperCase() || "ABOUT THE GALLERY"}
          </h1>
          <AboutContactNav slug={slug} active="about" />
        </div>

        <div>
          {!hasAbout ? (
            <p className="text-sm text-[color:var(--color-gallery-fg)]/50">
              This gallery hasn&apos;t added an About section yet.
            </p>
          ) : (
            <>
              {paragraphs.length > 0 && (
                <div className="max-w-2xl space-y-4">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[color:var(--color-gallery-fg)]/70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}

          {gallery.aboutPhotoUrl && (
            <div className="mt-12">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src={gallery.aboutPhotoUrl}
                  alt={gallery.aboutHeading || "About"}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {featuredArtwork?.imageUrl && (
            <div className="mt-12">
              <h2 className="font-serif text-lg tracking-wide text-[color:var(--color-gallery-fg)] mb-4">
                FEATURED WORK
              </h2>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 rounded-lg">
                <Image
                  src={featuredArtwork.imageUrl}
                  alt={featuredArtwork.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-[color:var(--color-gallery-fg)]/60">
                <span className="italic">{featuredArtwork.title}</span>
                {`, ${getArtistName(featuredArtwork)}`}
                {featuredArtwork.year ? `, ${featuredArtwork.year}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
