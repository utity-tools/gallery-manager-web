import Image from "next/image";
import type { ApiArtist } from "@/lib/types/models";

interface ShowArtistsSelectProps {
  artists: ApiArtist[];
  selectedIds: string[];
  onToggle: (artistId: string) => void;
}

export default function ShowArtistsSelect({ artists, selectedIds, onToggle }: ShowArtistsSelectProps) {
  if (artists.length === 0) {
    return <p className="text-sm text-gray-500">This gallery has no artists yet.</p>;
  }

  return (
    <div data-testid="show-artists-select" className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
      {artists.map((artist) => {
        const isSelected = selectedIds.includes(artist.id);
        return (
          <label
            key={artist.id}
            className={`flex items-center gap-3 rounded-md border border-gray-200 p-2 ${
              isSelected ? "border-accent-300 bg-accent-50" : "cursor-pointer hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              data-testid={`show-artist-checkbox-${artist.id}`}
              checked={isSelected}
              onChange={() => onToggle(artist.id)}
              className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
            />
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {artist.photoUrl && <Image src={artist.photoUrl} alt={artist.name} fill className="object-cover" />}
            </div>
            <span className="truncate text-sm text-gray-900">{artist.name}</span>
          </label>
        );
      })}
    </div>
  );
}
