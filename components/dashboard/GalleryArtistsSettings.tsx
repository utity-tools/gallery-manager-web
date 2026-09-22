"use client";

import { useArtists } from "@/hooks/useArtists";
import type { ApiGallery } from "@/lib/types/models";

interface GalleryArtistsSettingsProps {
  gallery: ApiGallery;
}

export default function GalleryArtistsSettings({ gallery }: GalleryArtistsSettingsProps) {
  const { artists, total } = useArtists({ galleryId: gallery.id, limit: 5 });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Artists Overview</h3>
        <p className="mt-1 text-sm text-gray-600">
          You have <span className="font-semibold">{total}</span> artist{total !== 1 ? "s" : ""} in your gallery.
        </p>
      </div>

      {artists.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-semibold text-gray-700">RECENT ARTISTS</p>
          <div className="space-y-2">
            {artists.slice(0, 5).map((artist) => (
              <div key={artist.id} className="text-xs text-gray-600">
                <p className="font-medium text-gray-900">{artist.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Manage your artists and their featured works in the <strong>Artists</strong> section of the dashboard.
      </p>
    </div>
  );
}
