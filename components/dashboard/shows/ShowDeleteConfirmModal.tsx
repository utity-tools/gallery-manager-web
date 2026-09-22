"use client";

import { AlertTriangle } from "lucide-react";
import type { ApiShow } from "@/lib/types/models";

interface ShowDeleteConfirmModalProps {
  isOpen: boolean;
  show: ApiShow | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ShowDeleteConfirmModal({
  isOpen,
  show,
  onConfirm,
  onCancel,
  isLoading,
}: ShowDeleteConfirmModalProps) {
  if (!isOpen || !show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        data-testid="show-delete-confirm-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">Delete exhibition</h2>
        <p className="mt-2 text-sm text-gray-600">
          Delete &ldquo;{show.title}&rdquo;? This action cannot be undone.
        </p>

        <p className="mt-3 flex items-start gap-2 rounded-md border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          The artworks and artists themselves won&apos;t be deleted — only their link to this
          exhibition.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            data-testid="show-delete-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
