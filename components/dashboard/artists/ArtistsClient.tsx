"use client";

import { useCallback, useMemo, useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useArtists } from "@/hooks/useArtists";
import ArtistsFilter, { type ArtworksFilterValue } from "@/components/dashboard/artists/ArtistsFilter";
import ArtistsTable from "@/components/dashboard/artists/ArtistsTable";
import ArtistModal from "@/components/dashboard/artists/ArtistModal";
import DeleteConfirmModal from "@/components/dashboard/artists/DeleteConfirmModal";
import Pagination from "@/components/Pagination";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ArtistFormValues } from "@/lib/validation";
import type { ApiArtist } from "@/lib/types/models";

interface ArtistsClientProps {
  slug: string;
}

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error";
}

export default function ArtistsClient({ slug }: ArtistsClientProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterArtworks, setFilterArtworks] = useState<ArtworksFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<ApiArtist | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiArtist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((message: string, variant: Toast["variant"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const { gallery, isLoading: galleryLoading, error: galleryError } = useGallery();
  const {
    artists,
    isLoading: artistsLoading,
    error: artistsError,
    totalPages: allTotalPages,
    addArtist,
    updateArtist,
    deleteArtist,
  } = useArtists({ galleryId: gallery?.id, page: currentPage });

  const filteredArtists = useMemo(() => {
    const query = search.trim().toLowerCase();
    return artists.filter((artist) => {
      if (query && !artist.name.toLowerCase().includes(query)) return false;
      if (filterCountry !== "all" && artist.country !== filterCountry) return false;
      if (filterArtworks === "has" && artist.artworkCount === 0) return false;
      if (filterArtworks === "empty" && artist.artworkCount > 0) return false;
      return true;
    });
  }, [artists, search, filterCountry, filterArtworks]);

  const openAddModal = () => {
    setEditingArtist(null);
    setModalOpen(true);
  };

  const openEditModal = (artist: ApiArtist) => {
    setEditingArtist(artist);
    setModalOpen(true);
  };

  const handleSubmit = async (values: ArtistFormValues) => {
    if (editingArtist) {
      await updateArtist(editingArtist.id, values);
      showToast("Artist updated", "success");
    } else {
      await addArtist(values);
      showToast("Artist added", "success");
    }
    setModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const cascaded = await deleteArtist(deleteTarget.id);
      const cascadeParts = [
        cascaded.artworks ? `${cascaded.artworks} artwork(s)` : null,
        cascaded.exhibitions ? `${cascaded.exhibitions} exhibition(s)` : null,
        cascaded.artfairs ? `${cascaded.artfairs} art fair(s)` : null,
      ].filter(Boolean);
      showToast(
        cascadeParts.length > 0
          ? `Artist deleted, along with ${cascadeParts.join(", ")}`
          : "Artist deleted",
        "success"
      );
      setDeleteTarget(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to delete artist.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {(galleryError || artistsError) && (
          <p className="text-sm text-danger-600">{galleryError ?? artistsError}</p>
        )}

        <ArtistsFilter
          search={search}
          onSearchChange={setSearch}
          filterCountry={filterCountry}
          onCountryChange={setFilterCountry}
          filterArtworks={filterArtworks}
          onArtworksChange={setFilterArtworks}
          artists={artists}
          onAddClick={openAddModal}
        />

        <ArtistsTable
          artists={filteredArtists}
          isLoading={galleryLoading || artistsLoading}
          slug={slug}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
        />

        {allTotalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={allTotalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}

        <ArtistModal
          isOpen={modalOpen}
          artist={editingArtist}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />

        <DeleteConfirmModal
          isOpen={deleteTarget !== null}
          artist={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
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
