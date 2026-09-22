"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { galleryBrandingSchema, type GalleryBrandingFormValues } from "@/lib/validation";
import ImagePreview from "@/components/dashboard/artists/ImagePreview";
import type { ApiError } from "@/lib/types/models";

interface GalleryBrandingSettingsProps {
  logoUrl?: string;
  logoDarkUrl?: string;
  onSave: (values: { logoUrl?: string; logoDarkUrl?: string }) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

export default function GalleryBrandingSettings({
  logoUrl,
  logoDarkUrl,
  onSave,
}: GalleryBrandingSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GalleryBrandingFormValues>({
    resolver: zodResolver(galleryBrandingSchema),
    defaultValues: {
      logoUrl: logoUrl ?? "",
      logoDarkUrl: logoDarkUrl ?? "",
    },
  });

  const startEditing = () => {
    reset({ logoUrl: logoUrl ?? "", logoDarkUrl: logoDarkUrl ?? "" });
    setFormError(null);
    setIsEditing(true);
  };

  const onSubmit = async (values: GalleryBrandingFormValues) => {
    setFormError(null);
    try {
      await onSave(values);
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save branding settings.");
    }
  };

  const logoUrlValue = watch("logoUrl");
  const logoDarkUrlValue = watch("logoDarkUrl");

  if (isEditing) {
    return (
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Gallery Logo</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
              Light Mode Logo
            </label>
            <p className="mt-1 text-xs text-gray-500">PNG format, at least 200x100px</p>
            <input
              id="logoUrl"
              placeholder="https://..."
              {...register("logoUrl")}
              className={inputClass}
            />
            {errors.logoUrl && <p className="mt-1 text-sm text-danger-600">{errors.logoUrl.message}</p>}
            {logoUrlValue && (
              <div className="mt-3">
                <ImagePreview url={logoUrlValue || undefined} alt="Logo preview" size="sm" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="logoDarkUrl" className="block text-sm font-medium text-gray-700">
              Dark Mode Logo (Optional)
            </label>
            <p className="mt-1 text-xs text-gray-500">Used when gallery theme is set to dark</p>
            <input
              id="logoDarkUrl"
              placeholder="https://..."
              {...register("logoDarkUrl")}
              className={inputClass}
            />
            {errors.logoDarkUrl && (
              <p className="mt-1 text-sm text-danger-600">{errors.logoDarkUrl.message}</p>
            )}
            {logoDarkUrlValue && (
              <div className="mt-3 rounded-lg bg-gray-900 p-4">
                <ImagePreview url={logoDarkUrlValue || undefined} alt="Dark logo preview" size="sm" />
              </div>
            )}
          </div>

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
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gallery Logo</h3>
          <p className="mt-1 text-sm text-gray-600">Appears in your website header and footer</p>
        </div>
        <button onClick={startEditing} className="text-sm text-accent-600 hover:text-accent-700">
          Edit
        </button>
      </div>

      {logoUrl && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500">Light Mode</p>
          <div className="mt-2">
            <ImagePreview url={logoUrl} alt="Logo" size="sm" />
          </div>
        </div>
      )}

      {logoDarkUrl && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-500">Dark Mode</p>
          <div className="mt-2 rounded-lg bg-gray-900 p-4">
            <ImagePreview url={logoDarkUrl} alt="Dark logo" size="sm" />
          </div>
        </div>
      )}

      {!logoUrl && !logoDarkUrl && (
        <p className="mt-4 text-sm text-gray-500">No logo uploaded yet. Click Edit to add one.</p>
      )}
    </div>
  );
}
