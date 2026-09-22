"use client";

import { AlertTriangle } from "lucide-react";
import type { Artwork } from "@/lib/types/models";

interface ArtworkDeleteConfirmModalProps {
  isOpen: boolean;
  artwork: Artwork | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArtworkDeleteConfirmModal({
  isOpen,
  artwork,
  onConfirm,
  onCancel,
  isLoading,
}: ArtworkDeleteConfirmModalProps) {
  if (!isOpen || !artwork) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        data-testid="delete-confirm-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">Delete Artwork</h2>
        <p className="mt-2 text-sm text-gray-600">
          Delete &ldquo;{artwork.title}&rdquo;? This action cannot be undone.
        </p>

        <p className="mt-3 flex items-start gap-2 rounded-md border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          Deleting will also remove any linked images.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            data-testid="delete-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading} className="btn-secondary disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
