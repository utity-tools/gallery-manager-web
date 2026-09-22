import Image from "next/image";
import type { ApiArtwork } from "@/lib/types/models";

interface ShowArtworksSelectProps {
  artworks: ApiArtwork[];
  selectedIds: string[];
  onToggle: (artworkId: string) => void;
}

export default function ShowArtworksSelect({ artworks, selectedIds, onToggle }: ShowArtworksSelectProps) {
  if (artworks.length === 0) {
    return <p className="text-sm text-gray-500">The selected artists have no artworks yet.</p>;
  }

  return (
    <div data-testid="show-artworks-select" className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
      {artworks.map((artwork) => {
        const isSelected = selectedIds.includes(artwork.id);
        return (
          <label
            key={artwork.id}
            className={`flex items-start gap-3 rounded-md border p-3 ${
              isSelected ? "border-accent-300 bg-accent-50" : "cursor-pointer border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              data-testid={`show-artwork-checkbox-${artwork.id}`}
              checked={isSelected}
              onChange={() => onToggle(artwork.id)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
            />
            <div className="min-w-0 flex-1">
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded bg-gray-100">
                {artwork.imageUrl && <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />}
              </div>
              <p className="truncate text-sm font-medium text-gray-900">{artwork.title}</p>
              {artwork.year && <p className="text-xs text-gray-500">{artwork.year}</p>}
            </div>
          </label>
        );
      })}
    </div>
  );
}
