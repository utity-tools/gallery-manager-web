"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySettingsSchema, type GallerySettingsFormValues } from "@/lib/validation";
import type { ApiError, ApiGallery, GalleryInput } from "@/lib/types/models";

interface GalleryInfoProps {
  gallery: ApiGallery;
  slug: string;
  artworkCount: number;
  onSave: (input: GalleryInput) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

export default function GalleryInfo({ gallery, slug, artworkCount, onSave }: GalleryInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GallerySettingsFormValues>({
    resolver: zodResolver(gallerySettingsSchema),
    defaultValues: {
      title: gallery.title,
      description: gallery.description ?? "",
      isPublic: gallery.isPublic,
    },
  });

  const startEditing = () => {
    reset({
      title: gallery.title,
      description: gallery.description ?? "",
      isPublic: gallery.isPublic,
    });
    setFormError(null);
    setIsEditing(true);
  };

  const onSubmit = async (values: GallerySettingsFormValues) => {
    setFormError(null);
    try {
      await onSave(values);
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save gallery settings.");
    }
  };

  const togglePublic = async () => {
    setFormError(null);
    try {
      await onSave({ isPublic: !gallery.isPublic });
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to update visibility.");
    }
  };

  if (isEditing) {
    return (
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Gallery title
            </label>
            <input id="title" {...register("title")} className={inputClass} />
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

          {formError && <p className="text-sm text-danger-600">{formError}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={startEditing}
            className="text-left text-xl font-semibold text-gray-900 hover:underline"
          >
            {gallery.title}
          </button>
          {gallery.description && (
            <p className="mt-1 max-w-md text-sm text-gray-600">{gallery.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {artworkCount} {artworkCount === 1 ? "artwork" : "artworks"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={gallery.isPublic}
              onChange={togglePublic}
              className="h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
            />
            Published
          </label>
          <Link
            href={`/gallery/${slug}`}
            target="_blank"
            className="text-sm text-gray-500 underline hover:text-gray-900"
          >
            View public gallery
          </Link>
        </div>
      </div>

      {formError && <p className="mt-3 text-sm text-danger-600">{formError}</p>}
    </div>
  );
}
