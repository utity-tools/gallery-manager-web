"use client";

import { useState } from "react";
import { useArtists } from "@/hooks/useArtists";

interface ArtistSelectProps {
  galleryId: string;
  value: string;
  onChange: (artistId: string) => void;
  error?: string;
}

const NEW_ARTIST_VALUE = "__new__";

export default function ArtistSelect({ galleryId, value, onChange, error }: ArtistSelectProps) {
  const { artists, isLoading, error: loadError, addArtist } = useArtists({ galleryId });
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === NEW_ARTIST_VALUE) {
      setIsAdding(true);
      return;
    }
    onChange(e.target.value);
  };

  const handleAddArtist = async () => {
    const name = newName.trim();
    if (!name) return;
    setIsSaving(true);
    setAddError(null);
    try {
      const artist = await addArtist({ name });
      onChange(artist.id);
      setIsAdding(false);
      setNewName("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Unable to add artist.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAdding || (!isLoading && artists.length === 0)) {
    return (
      <div className="mt-1 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New artist name"
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <button
            type="button"
            onClick={handleAddArtist}
            disabled={isSaving || !newName.trim()}
            className="btn-secondary shrink-0 disabled:opacity-50"
          >
            {isSaving ? "Adding..." : "Add"}
          </button>
          {artists.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddError(null);
              }}
              className="shrink-0 rounded-md px-3 py-2 text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
        </div>
        {addError && <p className="text-sm text-danger-600">{addError}</p>}
      </div>
    );
  }

  return (
    <div className="mt-1">
      <select
        value={value}
        onChange={handleSelectChange}
        disabled={isLoading}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
      >
        <option value="" disabled>
          {isLoading ? "Loading artists..." : "Select an artist"}
        </option>
        {artists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {artist.name}
          </option>
        ))}
        <option value={NEW_ARTIST_VALUE}>+ Add new artist...</option>
      </select>
      {(error || loadError) && (
        <p className="mt-1 text-sm text-danger-600">{error || loadError}</p>
      )}
    </div>
  );
}
