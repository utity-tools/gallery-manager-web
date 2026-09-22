"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { galleryAboutSchema, type GalleryAboutFormValues } from "@/lib/validation";
import type { ApiError, ApiGallery, GalleryInput } from "@/lib/types/models";
import ImagePreview from "@/components/dashboard/artists/ImagePreview";

interface GalleryAboutUsProps {
  gallery: ApiGallery;
  onSave: (input: GalleryInput) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

function defaultsFrom(gallery: ApiGallery): GalleryAboutFormValues {
  return {
    aboutHeading: gallery.aboutHeading ?? "",
    aboutText: gallery.aboutText ?? "",
    aboutPhotoUrl: gallery.aboutPhotoUrl ?? "",
  };
}

export default function GalleryAboutUs({ gallery, onSave }: GalleryAboutUsProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<GalleryAboutFormValues>({
    resolver: zodResolver(galleryAboutSchema),
    defaultValues: defaultsFrom(gallery),
  });

  useEffect(() => {
    reset(defaultsFrom(gallery));
  }, [gallery, reset]);

  const aboutHeading = watch("aboutHeading") ?? "";
  const aboutText = watch("aboutText") ?? "";
  const aboutPhotoUrl = watch("aboutPhotoUrl");

  const onSubmit = async (values: GalleryAboutFormValues) => {
    setFormError(null);
    try {
      await onSave(values);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save About Us.");
    }
  };

  return (
    <div data-testid="gallery-settings-section" className="card">
      <h2 className="text-lg font-semibold text-gray-900">About Us</h2>
      <p className="mt-1 text-sm text-gray-500">
        This content appears on your gallery&apos;s public About page.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
        <div>
          <label htmlFor="aboutPhotoUrl" className="block text-sm font-medium text-gray-700">
            About photo
          </label>
          <input
            id="aboutPhotoUrl"
            data-testid="gallery-about-photo-input"
            placeholder="https://..."
            {...register("aboutPhotoUrl")}
            className={inputClass}
          />
          {errors.aboutPhotoUrl && (
            <p className="mt-1 text-sm text-danger-600">{errors.aboutPhotoUrl.message}</p>
          )}
          <div className="mt-2">
            <ImagePreview
              url={aboutPhotoUrl || undefined}
              alt="About Us photo preview"
              size="lg"
              testId="gallery-about-photo-preview"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <label htmlFor="aboutHeading" className="block text-sm font-medium text-gray-700">
              About heading
            </label>
            <span className="text-xs text-gray-500">{aboutHeading.length} / 200</span>
          </div>
          <input
            id="aboutHeading"
            data-testid="gallery-about-heading"
            placeholder="Ej: Our Story"
            {...register("aboutHeading")}
            className={inputClass}
          />
          {errors.aboutHeading && (
            <p className="mt-1 text-sm text-danger-600">{errors.aboutHeading.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="aboutText" className="block text-sm font-medium text-gray-700">
              About text
            </label>
            <span className="text-xs text-gray-500">{aboutText.length} / 3000</span>
          </div>
          <textarea
            id="aboutText"
            data-testid="gallery-about-text"
            rows={8}
            placeholder="Tell visitors about your gallery..."
            {...register("aboutText")}
            className={inputClass}
          />
          {errors.aboutText && (
            <p className="mt-1 text-sm text-danger-600">{errors.aboutText.message}</p>
          )}
        </div>

        {formError && <p className="text-sm text-danger-600">{formError}</p>}

        <div className="flex gap-2 border-t border-gray-100 pt-6">
          <button
            type="submit"
            data-testid="gallery-about-save"
            disabled={isSubmitting || !isDirty}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            data-testid="gallery-about-reset"
            onClick={() => reset(defaultsFrom(gallery))}
            disabled={isSubmitting || !isDirty}
            className="btn-secondary disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
