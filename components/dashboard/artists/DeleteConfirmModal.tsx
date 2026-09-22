"use client";

import type { ApiArtist } from "@/lib/types/models";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  artist: ApiArtist | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  artist,
  onClose,
  onConfirm,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !artist) {
    return null;
  }

  const linkedCounts = [
    artist.artworkCount > 0 ? `${artist.artworkCount} artwork${artist.artworkCount === 1 ? "" : "s"}` : null,
    artist.exhibitionCount ? `${artist.exhibitionCount} exhibition${artist.exhibitionCount === 1 ? "" : "s"}` : null,
    artist.artfairCount ? `${artist.artfairCount} art fair${artist.artfairCount === 1 ? "" : "s"}` : null,
  ].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">Delete {artist.name}?</h2>
        <p className="mt-2 text-sm text-gray-600">
          This will also delete any linked artworks, exhibitions, and art fairs.
        </p>

        {linkedCounts.length > 0 && (
          <p className="mt-3 rounded-md border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
            This artist has {linkedCounts.join(", ")} that will be permanently deleted.
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onConfirm} disabled={isLoading} className="btn-danger disabled:opacity-50">
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button type="button" onClick={onClose} disabled={isLoading} className="btn-secondary disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
