"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artistSchema, type ArtistFormInput, type ArtistFormValues } from "@/lib/validation";
import { getArtist } from "@/lib/api";
import type { ApiArtist, ApiError, ArtistDetail } from "@/lib/types/models";
import ImagePreview from "@/components/dashboard/artists/ImagePreview";
import FeaturedArtworksSelect from "@/components/dashboard/artists/FeaturedArtworksSelect";

interface ArtistModalProps {
  isOpen: boolean;
  artist?: ApiArtist | null;
  onClose: () => void;
  onSubmit: (values: ArtistFormValues) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

const emptyValues: ArtistFormInput = {
  name: "",
  country: "",
  bio: "",
  photoUrl: "",
  biographyHeading: "",
  biographyText: "",
  biographyPhotoUrl: "",
  featuredArtworkIds: [],
};

export default function ArtistModal({ isOpen, artist, onClose, onSubmit }: ArtistModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ArtistDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const isEditMode = Boolean(artist);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArtistFormInput, unknown, ArtistFormValues>({
    resolver: zodResolver(artistSchema),
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormError(null);

    if (!artist) {
      setDetail(null);
      reset(emptyValues);
      return;
    }

    let cancelled = false;
    setIsLoadingDetail(true);
    getArtist(artist.id)
      .then((full) => {
        if (cancelled) return;
        setDetail(full);
        reset({
          name: full.name,
          country: full.country ?? "",
          birthYear: full.birthYear ?? undefined,
          bio: full.bio ?? "",
          photoUrl: full.photoUrl ?? "",
          biographyHeading: full.biographyHeading ?? "",
          biographyText: full.biographyText ?? "",
          biographyPhotoUrl: full.biographyPhotoUrl ?? "",
          featuredArtworkIds: full.featuredArtworks?.map((a) => a.id) ?? [],
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const apiError = err as ApiError;
        setFormError(apiError.message || "Unable to load artist details.");
        reset({
          name: artist.name,
          country: artist.country ?? "",
          birthYear: artist.birthYear ?? undefined,
          bio: artist.bio ?? "",
          photoUrl: artist.photoUrl ?? "",
        });
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, artist, reset]);

  if (!isOpen) {
    return null;
  }

  const photoUrl = watch("photoUrl");
  const biographyPhotoUrl = watch("biographyPhotoUrl");
  const biographyHeading = watch("biographyHeading") ?? "";
  const biographyText = watch("biographyText") ?? "";
  const featuredArtworkIds = watch("featuredArtworkIds") ?? [];

  const toggleFeaturedArtwork = (artworkId: string) => {
    const current = featuredArtworkIds;
    const next = current.includes(artworkId)
      ? current.filter((id) => id !== artworkId)
      : [...current, artworkId];
    setValue("featuredArtworkIds", next, { shouldValidate: true });
  };

  const handleFormSubmit = async (values: ArtistFormValues) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save artist. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-testid="artist-edit-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditMode ? `Edit artist: ${artist?.name}` : "Add artist"}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-6" noValidate>
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Basic info</p>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input id="name" data-testid="artist-name-input" {...register("name")} className={inputClass} />
              {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input id="country" {...register("country")} className={inputClass} />
                {errors.country && (
                  <p className="mt-1 text-sm text-danger-600">{errors.country.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700">
                  Birth year
                </label>
                <input id="birthYear" type="number" {...register("birthYear")} className={inputClass} />
                {errors.birthYear && (
                  <p className="mt-1 text-sm text-danger-600">{errors.birthYear.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Short bio
              </label>
              <textarea id="bio" rows={3} {...register("bio")} className={inputClass} />
              {errors.bio && <p className="mt-1 text-sm text-danger-600">{errors.bio.message}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Photos</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
                      Artist photo
                    </label>
                    <input
                      id="photoUrl"
                      data-testid="artist-photo-input"
                      {...register("photoUrl")}
                      className={inputClass}
                    />
                    {errors.photoUrl && (
                      <p className="mt-1 text-sm text-danger-600">{errors.photoUrl.message}</p>
                    )}
                    <div className="mt-2">
                      <ImagePreview
                        url={photoUrl || undefined}
                        alt="Artist photo preview"
                        size="sm"
                        testId="photo-preview-small"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="biographyPhotoUrl" className="block text-sm font-medium text-gray-700">
                      Biography photo
                    </label>
                    <input
                      id="biographyPhotoUrl"
                      data-testid="artist-biography-photo-input"
                      {...register("biographyPhotoUrl")}
                      className={inputClass}
                    />
                    {errors.biographyPhotoUrl && (
                      <p className="mt-1 text-sm text-danger-600">{errors.biographyPhotoUrl.message}</p>
                    )}
                    <div className="mt-2">
                      <ImagePreview
                        url={biographyPhotoUrl || undefined}
                        alt="Biography photo preview"
                        size="lg"
                        testId="photo-preview-large"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">Biography</p>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="biographyHeading" className="block text-sm font-medium text-gray-700">
                      Heading
                    </label>
                    <span className="text-xs text-gray-500">{biographyHeading.length} / 200</span>
                  </div>
                  <input
                    id="biographyHeading"
                    data-testid="artist-biography-heading"
                    placeholder="Ej: Early Life & Artistic Journey"
                    {...register("biographyHeading")}
                    className={inputClass}
                  />
                  {errors.biographyHeading && (
                    <p className="mt-1 text-sm text-danger-600">{errors.biographyHeading.message}</p>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="biographyText" className="block text-sm font-medium text-gray-700">
                      Text
                    </label>
                    <span className="text-xs text-gray-500">{biographyText.length} / 3000</span>
                  </div>
                  <textarea
                    id="biographyText"
                    data-testid="artist-biography-text"
                    rows={10}
                    placeholder="Escribe biografía detallada..."
                    {...register("biographyText")}
                    className={inputClass}
                  />
                  {errors.biographyText && (
                    <p className="mt-1 text-sm text-danger-600">{errors.biographyText.message}</p>
                  )}
                </div>
              </div>

          {isEditMode && (
            <div className="border-t border-gray-100 pt-6">
              <p className="mb-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Featured artworks
              </p>
              {isLoadingDetail ? (
                <p className="text-sm text-gray-500">Loading artworks...</p>
              ) : (
                <FeaturedArtworksSelect
                  artworks={detail?.artworks ?? []}
                  selectedIds={featuredArtworkIds}
                  onToggle={toggleFeaturedArtwork}
                />
              )}
              {errors.featuredArtworkIds && (
                <p className="mt-1 text-sm text-danger-600">{errors.featuredArtworkIds.message}</p>
              )}
            </div>
          )}

          {formError && <p className="text-sm text-danger-600">{formError}</p>}

          <div className="flex gap-2 border-t border-gray-100 pt-6">
            <button
              type="submit"
              data-testid="artist-save-btn"
              disabled={isSubmitting || !watch("name")?.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Add artist"}
            </button>
            <button
              type="button"
              data-testid="artist-cancel-btn"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
