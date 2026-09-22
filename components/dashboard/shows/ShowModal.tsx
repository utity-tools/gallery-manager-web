"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showSchema, type ShowFormInput, type ShowFormValues } from "@/lib/validation";
import { getArtworks, getGalleryArtists, getShow } from "@/lib/api";
import type { ApiArtist, ApiArtwork, ApiError, ApiShow } from "@/lib/types/models";
import ImagePreview from "@/components/dashboard/artists/ImagePreview";
import ShowArtistsSelect from "@/components/dashboard/shows/ShowArtistsSelect";
import ShowArtworksSelect from "@/components/dashboard/shows/ShowArtworksSelect";

interface ShowModalProps {
  isOpen: boolean;
  show?: ApiShow | null;
  galleryId: string;
  onClose: () => void;
  onSubmit: (values: ShowFormValues) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

const emptyValues: ShowFormInput = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  venueName: "",
  address: "",
  city: "",
  country: "",
  coverImageUrl: "",
  isPublic: true,
  artistIds: [],
  artworkIds: [],
};

export default function ShowModal({ isOpen, show, galleryId, onClose, onSubmit }: ShowModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [artists, setArtists] = useState<ApiArtist[]>([]);
  const [artworks, setArtworks] = useState<ApiArtwork[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [unlinkNotice, setUnlinkNotice] = useState<string | null>(null);
  const isEditMode = Boolean(show);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShowFormInput, unknown, ShowFormValues>({
    resolver: zodResolver(showSchema),
  });

  useEffect(() => {
    if (!isOpen || !galleryId) return;
    let cancelled = false;
    setIsLoadingLists(true);
    Promise.all([getGalleryArtists(galleryId), getArtworks(galleryId, 1, 200)])
      .then(([artistsRes, artworksRes]) => {
        if (cancelled) return;
        setArtists(artistsRes);
        setArtworks(artworksRes.artworks);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, galleryId]);

  useEffect(() => {
    if (!isOpen) return;
    setFormError(null);
    setUnlinkNotice(null);

    if (!show) {
      reset(emptyValues);
      return;
    }

    let cancelled = false;
    getShow(show.id)
      .then((detail) => {
        if (cancelled) return;
        reset({
          title: detail.title,
          description: detail.description ?? "",
          startDate: detail.startDate?.slice(0, 10) ?? "",
          endDate: detail.endDate?.slice(0, 10) ?? "",
          venueName: detail.venueName ?? "",
          address: detail.address ?? "",
          city: detail.city ?? "",
          country: detail.country ?? "",
          coverImageUrl: detail.coverImageUrl ?? "",
          isPublic: detail.isPublic,
          artistIds: detail.artists.map((a) => a.id),
          artworkIds: detail.artworks.map((a) => a.id),
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const apiError = err as ApiError;
        setFormError(apiError.message || "Unable to load exhibition details.");
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, show, reset]);

  if (!isOpen) {
    return null;
  }

  const coverImageUrl = watch("coverImageUrl");
  const artistIds = watch("artistIds") ?? [];
  const artworkIds = watch("artworkIds") ?? [];

  const toggleArtist = (artistId: string) => {
    const isRemoving = artistIds.includes(artistId);

    if (isRemoving) {
      const removedArtwork = artworks.filter(
        (a) => a.artistId === artistId && artworkIds.includes(a.id)
      );
      setValue(
        "artistIds",
        artistIds.filter((id) => id !== artistId),
        { shouldValidate: true }
      );
      if (removedArtwork.length > 0) {
        const removedIds = new Set(removedArtwork.map((a) => a.id));
        setValue(
          "artworkIds",
          artworkIds.filter((id) => !removedIds.has(id)),
          { shouldValidate: true }
        );
        const artistName = artists.find((a) => a.id === artistId)?.name ?? "This artist";
        setUnlinkNotice(
          `${artistName} removed — their ${removedArtwork.length} artwork${
            removedArtwork.length === 1 ? "" : "s"
          } ${removedArtwork.length === 1 ? "was" : "were"} also removed from this exhibition.`
        );
      }
    } else {
      setValue("artistIds", [...artistIds, artistId], { shouldValidate: true });
    }
  };

  const toggleArtwork = (artworkId: string) => {
    const next = artworkIds.includes(artworkId)
      ? artworkIds.filter((id) => id !== artworkId)
      : [...artworkIds, artworkId];
    setValue("artworkIds", next, { shouldValidate: true });
  };

  const availableArtworks = artworks.filter((a) => a.artistId && artistIds.includes(a.artistId));

  const handleFormSubmit = async (values: ShowFormValues) => {
    setFormError(null);
    try {
      // The backend's coverImageUrl validator rejects "" as "not a valid URL"
      // (unlike the plain text fields, which accept "" fine) — omit it
      // entirely when blank instead of sending an empty string.
      const payload = { ...values };
      if (!payload.coverImageUrl) {
        delete payload.coverImageUrl;
      }
      await onSubmit(payload);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save exhibition. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-testid="show-edit-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditMode ? `Edit exhibition: ${show?.title}` : "Add exhibition"}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-6" noValidate>
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Basic info</p>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input id="title" data-testid="show-title-input" {...register("title")} className={inputClass} />
              {errors.title && <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea id="description" rows={3} {...register("description")} className={inputClass} />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("isPublic")}
                className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
              />
              Published (visible to the public)
            </label>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Dates &amp; venue</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start date
                </label>
                <input
                  id="startDate"
                  type="date"
                  data-testid="show-start-date"
                  {...register("startDate")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End date
                </label>
                <input
                  id="endDate"
                  type="date"
                  data-testid="show-end-date"
                  {...register("endDate")}
                  className={inputClass}
                />
                {errors.endDate && <p className="mt-1 text-sm text-danger-600">{errors.endDate.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <input id="venueName" {...register("venueName")} className={inputClass} />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input id="address" {...register("address")} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input id="city" {...register("city")} className={inputClass} />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input id="country" {...register("country")} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Cover photo</p>
            <input
              id="coverImageUrl"
              data-testid="show-cover-input"
              placeholder="https://..."
              {...register("coverImageUrl")}
              className={inputClass}
            />
            {errors.coverImageUrl && (
              <p className="mt-1 text-sm text-danger-600">{errors.coverImageUrl.message}</p>
            )}
            <div className="mt-2">
              <ImagePreview
                url={coverImageUrl || undefined}
                alt="Cover preview"
                size="lg"
                testId="show-cover-preview"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Artists</p>
            {isLoadingLists ? (
              <p className="text-sm text-gray-500">Loading artists...</p>
            ) : (
              <ShowArtistsSelect artists={artists} selectedIds={artistIds} onToggle={toggleArtist} />
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">Artworks</p>
            <p className="mb-4 text-xs text-gray-500">
              Only artworks by artists already added above can be selected. Removing an artist also
              removes their artworks from this exhibition.
            </p>
            {unlinkNotice && (
              <p className="mb-3 rounded-md border border-warning-200 bg-warning-50 px-3 py-2 text-xs text-warning-700">
                {unlinkNotice}
              </p>
            )}
            {artistIds.length === 0 ? (
              <p className="text-sm text-gray-500">Add an artist first to select their artworks.</p>
            ) : isLoadingLists ? (
              <p className="text-sm text-gray-500">Loading artworks...</p>
            ) : (
              <ShowArtworksSelect
                artworks={availableArtworks}
                selectedIds={artworkIds}
                onToggle={toggleArtwork}
              />
            )}
          </div>

          {formError && <p className="text-sm text-danger-600">{formError}</p>}

          <div className="flex gap-2 border-t border-gray-100 pt-6">
            <button
              type="submit"
              data-testid="show-save-btn"
              disabled={isSubmitting || !watch("title")?.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Add exhibition"}
            </button>
            <button type="button" data-testid="show-cancel-btn" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
