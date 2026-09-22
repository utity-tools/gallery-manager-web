"use client";

import { useCallback, useMemo, useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useArtworks } from "@/hooks/useArtworks";
import ArtworksFilter from "@/components/dashboard/artworks/ArtworksFilter";
import ArtworksGrid from "@/components/dashboard/artworks/ArtworksGrid";
import ArtworkDeleteConfirmModal from "@/components/dashboard/artworks/ArtworkDeleteConfirmModal";
import ArtworkModal from "@/components/dashboard/ArtworkModal";
import Pagination from "@/components/Pagination";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ArtworkFormValues } from "@/lib/validation";
import type { Artwork } from "@/lib/types/models";

interface ArtworksClientProps {
  slug: string;
}

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error";
}

const ITEMS_PER_PAGE = 12;

export default function ArtworksClient({ slug }: ArtworksClientProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [search, setSearch] = useState("");
  const [filterArtist, setFilterArtist] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((message: string, variant: Toast["variant"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const { gallery, isLoading: galleryLoading, error: galleryError } = useGallery();
  const {
    artworks,
    isLoading: artworksLoading,
    error: artworksError,
    add,
    update,
    remove,
  } = useArtworks({ galleryId: gallery?.id, limit: 100 });

  const filteredArtworks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return artworks.filter((artwork) => {
      if (query && !artwork.title.toLowerCase().includes(query)) return false;
      if (filterArtist !== "all" && artwork.artist?.id !== filterArtist) return false;
      if (filterYear !== "all" && String(artwork.year ?? "") !== filterYear) return false;
      return true;
    });
  }, [artworks, search, filterArtist, filterYear]);

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArtworks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArtworks, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAddModal = () => {
    setEditingArtwork(null);
    setModalOpen(true);
  };

  const openEditModal = (artwork: Artwork) => {
    setEditingArtwork(artwork);
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
      showToast(err instanceof Error ? err.message : "Unable to delete artwork.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (values: ArtworkFormValues) => {
    if (editingArtwork) {
      await update(editingArtwork.id, values);
      showToast("Artwork updated", "success");
    } else {
      await add(values);
      showToast("Artwork added", "success");
    }
    setModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {(galleryError || artworksError) && (
          <p className="text-sm text-danger-600">{galleryError ?? artworksError}</p>
        )}

        <ArtworksFilter
          search={search}
          onSearchChange={setSearch}
          filterArtist={filterArtist}
          onArtistChange={setFilterArtist}
          filterYear={filterYear}
          onYearChange={setFilterYear}
          artworks={artworks}
          onAddClick={openAddModal}
        />

        <ArtworksGrid
          artworks={paginatedArtworks}
          slug={slug}
          onDelete={setDeleteConfirm}
          onEdit={openEditModal}
          isLoading={galleryLoading || artworksLoading}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}

        <ArtworkModal
          isOpen={modalOpen}
          artwork={editingArtwork}
          galleryId={gallery?.id ?? ""}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />

        <ArtworkDeleteConfirmModal
          isOpen={deleteConfirm !== null}
          artwork={deleteConfirm}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={isDeleting}
        />

        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
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
