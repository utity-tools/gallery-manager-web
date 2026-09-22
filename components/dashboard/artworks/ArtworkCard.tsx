import Image from "next/image";
import { getArtistName, type Artwork } from "@/lib/types/models";

interface ArtworkCardProps {
  artwork: Artwork;
  slug: string;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, slug, onEdit, onDelete }: ArtworkCardProps) {
  const price = artwork.price ? Number(artwork.price) : null;

  return (
    <div
      data-testid="artwork-card"
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover"
    >
      {artwork.imageUrl ? (
        <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center bg-gray-100">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="space-y-1 p-4">
        <h3 className="truncate font-semibold text-gray-900">{artwork.title}</h3>
        <p className="truncate text-sm text-gray-600">{getArtistName(artwork)}</p>
        <p className="text-xs text-gray-500">
          {[artwork.year, price !== null ? price.toLocaleString() : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="flex items-center gap-3 pt-2 text-sm">
          <button
            type="button"
            onClick={() => onEdit(artwork)}
            className="text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            data-testid="artwork-delete-btn"
            onClick={() => onDelete(artwork)}
            className="text-danger-600 underline-offset-2 hover:text-danger-700 hover:underline"
          >
            Delete
          </button>
          <a
            href={`/gallery/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}
