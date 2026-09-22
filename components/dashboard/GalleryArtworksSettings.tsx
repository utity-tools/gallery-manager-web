"use client";

import { useArtworks } from "@/hooks/useArtworks";
import type { ApiGallery } from "@/lib/types/models";

interface GalleryArtworksSettingsProps {
  gallery: ApiGallery;
}

export default function GalleryArtworksSettings({ gallery }: GalleryArtworksSettingsProps) {
  const { total } = useArtworks({ galleryId: gallery.id, limit: 5 });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Artworks Overview</h3>
        <p className="mt-1 text-sm text-gray-600">
          You have <span className="font-semibold">{total}</span> artwork{total !== 1 ? "s" : ""} in your gallery.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold text-gray-700">PUBLIC GALLERY</p>
        <p className="text-xs text-gray-600">
          All artworks are displayed in a masonry grid at <code className="font-mono text-xs">/gallery/{gallery.id}/artworks</code> with pagination (12 per page).
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Manage your artworks, pricing, and media in the <strong>Artworks</strong> section of the dashboard.
      </p>
    </div>
  );
}
