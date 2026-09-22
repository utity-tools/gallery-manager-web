import type { Artwork } from "@/lib/types/models";
import ArtworkCard from "@/components/dashboard/artworks/ArtworkCard";

interface ArtworksGridProps {
  artworks: Artwork[];
  slug: string;
  onDelete: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  isLoading?: boolean;
}

export default function ArtworksGrid({
  artworks,
  slug,
  onDelete,
  onEdit,
  isLoading,
}: ArtworksGridProps) {
  if (isLoading) {
    return <p className="py-12 text-center text-sm text-gray-500">Loading artworks...</p>;
  }

  if (artworks.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500" data-testid="artworks-table">
        No artworks match your filters.
      </p>
    );
  }

  return (
    <div
      data-testid="artworks-table"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
    >
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          slug={slug}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
