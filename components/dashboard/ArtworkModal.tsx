"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkSchema, type ArtworkFormInput, type ArtworkFormValues } from "@/lib/validation";
import type { ApiError, Artwork } from "@/lib/types/models";
import ImageUpload from "@/components/dashboard/ImageUpload";
import ArtistSelect from "@/components/dashboard/ArtistSelect";

interface ArtworkModalProps {
  isOpen: boolean;
  artwork?: Artwork | null;
  galleryId: string;
  onClose: () => void;
  onSubmit: (values: ArtworkFormValues) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

export default function ArtworkModal({
  isOpen,
  artwork,
  galleryId,
  onClose,
  onSubmit,
}: ArtworkModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const isEditMode = Boolean(artwork);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormInput, unknown, ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
  });

  const imageUrl = watch("imageUrl");
  const artistId = watch("artistId");

  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      reset(
        artwork
          ? {
              title: artwork.title,
              artistId: artwork.artistId ?? artwork.artist?.id ?? "",
              imageUrl: artwork.imageUrl ?? "",
              description: artwork.description ?? "",
              year: artwork.year ?? undefined,
              price: artwork.price ? Number(artwork.price) : undefined,
            }
          : { title: "", artistId: "", imageUrl: "", description: "" }
      );
    }
  }, [isOpen, artwork, reset]);

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = async (values: ArtworkFormValues) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save artwork. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg border border-gray-100 bg-white p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditMode ? "Edit artwork" : "Add artwork"}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input id="title" {...register("title")} className={inputClass} />
            {errors.title && <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>}
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700">Artist</span>
            <input type="hidden" {...register("artistId")} />
            <ArtistSelect
              galleryId={galleryId}
              value={artistId ?? ""}
              onChange={(id) => setValue("artistId", id, { shouldValidate: true })}
              error={errors.artistId?.message}
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700">Image</span>
            <input type="hidden" {...register("imageUrl")} />
            <div className="mt-1">
              <ImageUpload
                galleryId={galleryId}
                currentImage={imageUrl || undefined}
                onUpload={(url) => setValue("imageUrl", url, { shouldValidate: true })}
                onError={(message) => setFormError(message)}
              />
            </div>
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-danger-600">{errors.imageUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea id="description" rows={3} {...register("description")} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input id="year" type="number" {...register("year")} className={inputClass} />
              {errors.year && <p className="mt-1 text-sm text-danger-600">{errors.year.message}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                className={inputClass}
              />
              {errors.price && <p className="mt-1 text-sm text-danger-600">{errors.price.message}</p>}
            </div>
          </div>

          {formError && <p className="text-sm text-danger-600">{formError}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
              {isSubmitting ? "Saving..." : isEditMode ? "Save changes" : "Add artwork"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
