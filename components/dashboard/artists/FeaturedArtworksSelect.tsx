import Image from "next/image";
import type { ApiArtwork } from "@/lib/types/models";

interface FeaturedArtworksSelectProps {
  artworks: ApiArtwork[];
  selectedIds: string[];
  onToggle: (artworkId: string) => void;
  maxSelected?: number;
}

export default function FeaturedArtworksSelect({
  artworks,
  selectedIds,
  onToggle,
  maxSelected = 8,
}: FeaturedArtworksSelectProps) {
  const atLimit = selectedIds.length >= maxSelected;

  return (
    <div data-testid="featured-artworks-select" className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-gray-700">Featured artworks</span>
        <span className="text-xs text-gray-500">
          {selectedIds.length} / {maxSelected} selected
        </span>
      </div>

      {artworks.length === 0 ? (
        <p className="text-sm text-gray-500">This artist has no artworks yet.</p>
      ) : (
        <div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
          {artworks.map((artwork) => {
            const isSelected = selectedIds.includes(artwork.id);
            const isDisabled = atLimit && !isSelected;
            return (
              <label
                key={artwork.id}
                className={`flex items-start gap-3 rounded-md border border-gray-200 p-3 ${
                  isDisabled ? "opacity-50" : "cursor-pointer hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  data-testid={`artwork-checkbox-${artwork.id}`}
                  checked={isSelected}
                  onChange={() => onToggle(artwork.id)}
                  disabled={isDisabled}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="relative mb-2 h-16 w-16 overflow-hidden rounded bg-gray-100">
                    {artwork.imageUrl && (
                      <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />
                    )}
                  </div>
                  <p className="truncate text-sm font-medium text-gray-900">{artwork.title}</p>
                  {artwork.year && <p className="text-xs text-gray-500">{artwork.year}</p>}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {atLimit && <p className="text-xs text-warning-700">Max {maxSelected} artworks selected.</p>}
    </div>
  );
}
