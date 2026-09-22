import Image from "next/image";
import AboutContactNav from "@/components/gallery-public/AboutContactNav";
import ContactForm from "@/components/gallery-public/ContactForm";
import { getArtistName, type ApiArtwork, type ApiGallery } from "@/lib/types/models";

interface ContactPageViewProps {
  slug: string;
  gallery: ApiGallery;
  featuredArtwork: ApiArtwork | null;
}

export default function ContactPageView({ slug, gallery, featuredArtwork }: ContactPageViewProps) {
  return (
    <div data-testid="contact-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div>
          <h1 className="font-serif text-xl tracking-wide text-[color:var(--color-gallery-fg)]">
            CONTACT
          </h1>
          <AboutContactNav slug={slug} active="contact" />
        </div>

        <div>
          <blockquote className="border-l-2 border-[color:var(--color-gallery-border)] pl-6 font-serif text-xl leading-relaxed text-[color:var(--color-gallery-fg)] md:text-2xl">
            Get in touch with {gallery.title}
          </blockquote>

          <div className="mt-8 max-w-2xl">
            <ContactForm slug={slug} />
          </div>

          {featuredArtwork?.imageUrl && (
            <div className="mt-12">
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
