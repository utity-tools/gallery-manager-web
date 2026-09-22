import Image from "next/image";
import { getArtistName, type Artwork } from "@/lib/types/models";

interface ArtworksTableProps {
  artworks: Artwork[];
  isPublished: boolean;
  slug: string;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworksTable({
  artworks,
  isPublished,
  slug,
  onEdit,
  onDelete,
}: ArtworksTableProps) {
  if (artworks.length === 0) {
    return <p className="py-8 text-sm text-gray-500">No artworks yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs tracking-wide text-gray-500 uppercase">
            <th className="px-4 py-3 font-medium">Artwork</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Artist</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Status</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((artwork) => (
            <tr
              key={artwork.id}
              onClick={() => onEdit(artwork)}
              className="cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                    {artwork.imageUrl && (
                      <Image src={artwork.imageUrl} alt={artwork.title} fill className="object-cover" />
                    )}
                  </div>
                  <span className="truncate font-medium text-gray-900">{artwork.title}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{getArtistName(artwork)}</td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className={isPublished ? "badge-success" : "badge-warning"}>
                  {isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onEdit(artwork)}
                    className="text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
