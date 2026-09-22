import Link from "next/link";
import Image from "next/image";
import type { ApiArtist } from "@/lib/types/models";

interface ArtistsTableProps {
  artists: ApiArtist[];
  isLoading: boolean;
  slug: string;
  onEdit: (artist: ApiArtist) => void;
  onDelete: (artist: ApiArtist) => void;
}

export default function ArtistsTable({ artists, isLoading, slug, onEdit, onDelete }: ArtistsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return <p className="py-8 text-sm text-gray-500">No artists yet. Create one to get started.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs tracking-wide text-gray-500 uppercase">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Country</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Artworks</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {artist.photoUrl ? (
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={artist.photoUrl}
                        alt={artist.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-medium text-accent-700">
                      {artist.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{artist.name}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                {artist.country || "—"}
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{artist.artworkCount}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onEdit(artist)}
                    className="text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(artist)}
                    className="text-danger-600 underline-offset-2 hover:text-danger-700 hover:underline"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/gallery/${slug}/artist/${artist.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
