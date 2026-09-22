"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { galleryExtendedSettingsSchema, type GalleryExtendedSettingsFormValues } from "@/lib/validation";
import type { ApiError, GalleryInput } from "@/lib/types/models";

interface GalleryExtendedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<GalleryExtendedSettingsFormValues>;
  onSave: (values: Partial<GalleryInput>) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-gray-100 pt-6">
    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
    <div className="mt-4 space-y-4">{children}</div>
  </div>
);

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  value?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  hint,
  error,
  children,
}: FieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
    {children}
    {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
  </div>
);

export default function GalleryExtendedDrawer({
  isOpen,
  onClose,
  data,
  onSave,
}: GalleryExtendedDrawerProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GalleryExtendedSettingsFormValues>({
    resolver: zodResolver(galleryExtendedSettingsSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (values: GalleryExtendedSettingsFormValues) => {
    setFormError(null);
    try {
      const { hoursJson, ...rest } = values;
      const payload: Partial<GalleryInput> = {
        ...rest,
        ...(hoursJson && { hours: hoursJson }),
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Unable to save settings.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-[70] h-screen w-full max-w-2xl overflow-hidden bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Extended Settings</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Social Links */}
            <Section title="Social Media">
              <FormField label="Instagram" hint="https://instagram.com/yourprofile">
                <input {...register("instagramUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
              <FormField label="Facebook">
                <input {...register("facebookUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
              <FormField label="X (Twitter)">
                <input {...register("xUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
              <FormField label="WhatsApp">
                <input {...register("whatsappUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
              <FormField label="YouTube">
                <input {...register("youtubeUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
              <FormField label="LinkedIn">
                <input {...register("linkedinUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
            </Section>

            {/* Contact Information */}
            <Section title="Contact Information">
              <FormField
                label="Contact Email"
                hint="Displayed in footer and contact page"
                error={errors.contactEmail?.message}
              >
                <input {...register("contactEmail")} type="email" className={inputClass} />
              </FormField>
              <FormField label="Phone" hint="International format recommended">
                <input {...register("phone")} placeholder="+34 912 34 56 78" className={inputClass} />
              </FormField>
              <FormField label="Address">
                <input {...register("addressLine")} className={inputClass} />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="City">
                  <input {...register("city")} className={inputClass} />
                </FormField>
                <FormField label="Postal Code">
                  <input {...register("postalCode")} className={inputClass} />
                </FormField>
              </div>
              <FormField label="Country">
                <input {...register("country")} className={inputClass} />
              </FormField>
            </Section>

            {/* SEO */}
            <Section title="SEO & Sharing">
              <FormField
                label="Meta Title"
                hint="Appears in search results (max 60 characters)"
                error={errors.metaTitle?.message}
              >
                <input {...register("metaTitle")} className={inputClass} />
              </FormField>
              <FormField
                label="Meta Description"
                hint="Appears below title in search results (max 160 characters)"
                error={errors.metaDescription?.message}
              >
                <textarea {...register("metaDescription")} rows={2} className={inputClass} />
              </FormField>
              <FormField label="OG Image" hint="Shared when link is posted on social media">
                <input {...register("ogImageUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
            </Section>

            {/* Footer & Hours */}
            <Section title="Business Hours & Legal">
              <FormField
                label="Timezone"
                hint="e.g., Europe/Madrid, America/New_York"
                error={errors.timezone?.message}
              >
                <input {...register("timezone")} placeholder="Europe/Madrid" className={inputClass} />
              </FormField>
              <FormField label="Hours Note" hint="Exceptions like 'By appointment' or holiday closures">
                <textarea {...register("hoursNote")} rows={2} className={inputClass} />
              </FormField>
              <FormField label="Google Maps Link">
                <input {...register("googleMapsUrl")} placeholder="https://maps.google.com/..." className={inputClass} />
              </FormField>
              <FormField label="Gallery Name (Legal)">
                <input {...register("legalName")} className={inputClass} />
              </FormField>
              <FormField label="Tax ID / VAT Number">
                <input {...register("taxId")} className={inputClass} />
              </FormField>
              <FormField label="Privacy Policy URL">
                <input {...register("privacyPolicyUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
            </Section>

            {/* Announcement */}
            <Section title="Announcement Banner">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    {...register("announcementEnabled")}
                    className="h-4 w-4 rounded border-gray-300 text-accent-500"
                  />
                  Show announcement banner
                </label>
              </div>
              <FormField label="Announcement Text" hint="e.g., 'Closed for holidays until Jan 15'">
                <textarea {...register("announcementText")} rows={2} className={inputClass} />
              </FormField>
              <FormField label="Link (Optional)">
                <input {...register("announcementUrl")} placeholder="https://..." className={inputClass} />
              </FormField>
            </Section>

            {formError && <p className="text-sm text-danger-600">{formError}</p>}
          </form>
        </div>

        {/* Footer - sticky buttons */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-2">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
