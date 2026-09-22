"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { useGallery } from "@/hooks/useGallery";
import { useShows } from "@/hooks/useShows";
import ShowsSummary from "@/components/dashboard/shows/ShowsSummary";
import ShowsCalendar from "@/components/dashboard/shows/ShowsCalendar";
import ShowModal from "@/components/dashboard/shows/ShowModal";
import ShowDeleteConfirmModal from "@/components/dashboard/shows/ShowDeleteConfirmModal";
import DropdownMenu from "@/components/DropdownMenu";
import Pagination from "@/components/Pagination";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ShowFormValues } from "@/lib/validation";
import type { ApiShow } from "@/lib/types/models";

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error";
}

const ITEMS_PER_PAGE = 12;

export default function ShowsManager() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<ApiShow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ApiShow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((message: string, variant: Toast["variant"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const { gallery, isLoading: galleryLoading, error: galleryError } = useGallery();
  const { shows, totalPages, isLoading: showsLoading, error: showsError, add, update, remove } = useShows({
    galleryId: gallery?.id,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const openAddModal = () => {
    setEditingShow(null);
    setModalOpen(true);
  };

  const openEditModal = (show: ApiShow) => {
    setEditingShow(show);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await remove(deleteConfirm.id);
      showToast(`"${deleteConfirm.title}" deleted`, "success");
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete exhibition.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (values: ShowFormValues) => {
    if (editingShow) {
      await update(editingShow.id, values);
      showToast("Exhibition updated", "success");
    } else {
      await add(values);
      showToast("Exhibition added", "success");
    }
    setModalOpen(false);
  };

  const isLoading = galleryLoading || showsLoading;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {(galleryError || showsError) && (
          <p className="text-sm text-danger-600">{galleryError ?? showsError}</p>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Exhibitions</h2>
          <button
            type="button"
            data-testid="show-add-btn"
            onClick={openAddModal}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add exhibition
          </button>
        </div>

        {/* Summary */}
        {!isLoading && (
          <ShowsSummary shows={shows} />
        )}

        {/* Calendar + List Layout */}
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading exhibitions...</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Calendar (left, takes 2 cols on lg) */}
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Calendar</h3>
              <ShowsCalendar shows={shows} onSelectShow={openEditModal} />
            </div>

            {/* List (right sidebar) */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  All Exhibitions
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {shows.length === 0 ? (
                    <p className="text-xs text-gray-500">No exhibitions</p>
                  ) : (
                    shows.map((show) => (
                      <div
                        key={show.id}
                        className="rounded-lg border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow cursor-pointer group"
                        onClick={() => openEditModal(show)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate group-hover:text-accent-600">
                              {show.title}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {show.startDate
                                ? new Date(show.startDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "No date"}
                            </p>
                          </div>
                          <DropdownMenu
                            items={[
                              {
                                label: "Edit",
                                onClick: () => openEditModal(show),
                              },
                              {
                                label: "Delete",
                                onClick: () => setDeleteConfirm(show),
                                variant: "danger",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-4 flex justify-center"
                />
              )}
            </div>
          </div>
        )}

        <ShowModal
          isOpen={modalOpen}
          show={editingShow}
          galleryId={gallery?.id ?? ""}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />

        <ShowDeleteConfirmModal
          isOpen={deleteConfirm !== null}
          show={deleteConfirm}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={isDeleting}
        />

        <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-md px-4 py-2 text-sm text-white shadow-lg ${
                toast.variant === "success" ? "bg-success-600" : "bg-danger-600"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
