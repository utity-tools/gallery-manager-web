import Image from "next/image";
import Link from "next/link";
import { getArtistName, type ApiArtwork } from "@/lib/types/models";

interface RelatedWorksProps {
  artworks: ApiArtwork[];
  slug: string;
}

export default function RelatedWorks({ artworks, slug }: RelatedWorksProps) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {artworks.map((artwork) => (
        <Link key={artwork.id} href={`/gallery/${slug}/artwork/${artwork.id}`} className="group block">
          <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-gallery-border)]/30">
            {artwork.imageUrl ? (
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[color:var(--color-gallery-fg)]/40">
                No image
              </div>
            )}
          </div>
          <p className="mt-3 truncate text-sm text-[color:var(--color-gallery-fg)]">{artwork.title}</p>
          <p className="truncate text-xs text-[color:var(--color-gallery-fg)]/60">
            {getArtistName(artwork)}
          </p>
        </Link>
      ))}
    </div>
  );
}
