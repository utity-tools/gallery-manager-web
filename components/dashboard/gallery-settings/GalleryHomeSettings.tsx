"use client";

import { useEffect, useState, useMemo } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useArtworks } from "@/hooks/useArtworks";
import Image from "next/image";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import type { ApiArtwork } from "@/lib/types/models";

interface GalleryHomeSettingsProps {
  onSave: (heroArtworkIds: string[]) => Promise<void>;
  heroArtworkIds?: string[];
}

const MAX_HERO_SLIDES = 4;

export default function GalleryHomeSettings({
  onSave,
  heroArtworkIds = [],
}: GalleryHomeSettingsProps) {
  const { gallery } = useGallery();
  const { artworks } = useArtworks({ galleryId: gallery?.id, limit: 100 });

  const [selectedIds, setSelectedIds] = useState<string[]>(heroArtworkIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArtist, setFilterArtist] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIds(heroArtworkIds);
  }, [heroArtworkIds]);

  // Get unique artists
  const artists = useMemo(
    () => [...new Set(artworks.map((a) => a.artist?.name).filter(Boolean))].sort(),
    [artworks]
  );

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesArtist = filterArtist === "all" || artwork.artist?.name === filterArtist;

      return matchesSearch && matchesArtist;
    });
  }, [artworks, searchTerm, filterArtist]);

  const selectedArtworks = useMemo(
    () => selectedIds
      .map((id) => artworks.find((a) => a.id === id))
      .filter((a): a is ApiArtwork => Boolean(a)),
    [selectedIds, artworks]
  );

  const toggleSelect = (artworkId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(artworkId)) {
        return prev.filter((id) => id !== artworkId);
      } else if (prev.length < MAX_HERO_SLIDES) {
        return [...prev, artworkId];
      }
      return prev;
    });
  };

  const removeSelected = (artworkId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== artworkId));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedIds];
    [newIds[index], newIds[index - 1]] = [newIds[index - 1], newIds[index]];
    setSelectedIds(newIds);
  };

  const moveDown = (index: number) => {
    if (index === selectedIds.length - 1) return;
    const newIds = [...selectedIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    setSelectedIds(newIds);
  };

  const validateHeroArtworkIds = (ids: string[]): string | null => {
    if (ids.length > MAX_HERO_SLIDES) {
      return `Maximum ${MAX_HERO_SLIDES} slides allowed`;
    }
    if (new Set(ids).size !== ids.length) {
      return "Duplicate artworks not allowed";
    }
    const validIds = new Set(artworks.map((a) => a.id));
    if (!ids.every((id) => validIds.has(id))) {
      return "One or more artworks not found";
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateHeroArtworkIds(selectedIds);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onSave(selectedIds);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save carousel";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Home Hero Carousel</h3>
              {selectedIds.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2 py-1">
                  <span className="h-2 w-2 rounded-full bg-success-500" />
                  <span className="text-xs font-medium text-success-700">Active</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedIds.length} of {MAX_HERO_SLIDES} slides selected
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-accent-600 hover:text-accent-700 px-3 py-1.5 rounded-md hover:bg-accent-50"
          >
            Edit
          </button>
        </div>

        {selectedArtworks.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {selectedArtworks.map((artwork, idx) => (
              <div key={artwork.id} className="relative rounded-lg overflow-hidden bg-gray-100">
                {artwork.imageUrl ? (
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                  <p className="text-xs text-white truncate">{artwork.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-300">{idx + 1}/{MAX_HERO_SLIDES}</p>
                    {artwork.isPublic === false && (
                      <span className="text-xs bg-yellow-600 text-white px-1.5 rounded">🔒</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedArtworks.length === 0 && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              💡 No carousel configured yet. The public gallery will show a random artwork until you create one.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Select Hero Slides ({selectedIds.length}/{MAX_HERO_SLIDES})</h3>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Artworks List */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>

          <div>
            <select
              value={filterArtist}
              onChange={(e) => setFilterArtist(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="all">All Artists</option>
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-3">
            {filteredArtworks.length === 0 ? (
              <p className="text-sm text-gray-500">No artworks found.</p>
            ) : (
              filteredArtworks.map((artwork) => (
                <label
                  key={artwork.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                    artwork.isPublic === false ? "bg-gray-50 opacity-75" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(artwork.id)}
                    onChange={() => toggleSelect(artwork.id)}
                    disabled={selectedIds.length >= MAX_HERO_SLIDES && !selectedIds.includes(artwork.id)}
                    className="h-4 w-4 rounded border-gray-300 text-accent-500 disabled:opacity-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{artwork.title}</p>
                      {artwork.isPublic === false && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded whitespace-nowrap">
                          🔒 Private
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{artwork.artist?.name}</p>
                  </div>
                  {artwork.imageUrl && (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Right: Selected Preview & Order */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Selected Slides Order</h4>
          <div className="space-y-2">
            {selectedArtworks.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">Select artworks to preview</p>
            ) : (
              selectedArtworks.map((artwork, idx) => (
                <div
                  key={artwork.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border border-gray-200 ${
                    artwork.isPublic === false ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === selectedArtworks.length - 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-gray-600 w-6">{idx + 1}</div>

                  {artwork.imageUrl && (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{artwork.title}</p>
                      {artwork.isPublic === false && (
                        <span className="text-xs bg-yellow-200 text-yellow-900 px-1.5 py-0.5 rounded whitespace-nowrap">
                          🔒 Private
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{artwork.artist?.name}</p>
                  </div>

                  <button
                    onClick={() => removeSelected(artwork.id)}
                    className="p-1 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded"
                    aria-label="Remove"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-200 mt-6 pt-6">
        {error && (
          <div className="rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setError(null);
            }}
            disabled={isSaving}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
