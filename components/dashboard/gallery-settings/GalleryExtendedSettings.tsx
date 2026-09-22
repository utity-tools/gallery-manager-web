"use client";

import { useState } from "react";
import GalleryExtendedDrawer from "./GalleryExtendedDrawer";
import type { GalleryExtendedSettingsFormValues } from "@/lib/validation";
import type { GalleryInput } from "@/lib/types/models";

interface GalleryExtendedSettingsProps {
  data?: Partial<GalleryExtendedSettingsFormValues>;
  onSave: (values: Partial<GalleryInput>) => Promise<void>;
}

export default function GalleryExtendedSettings({
  data,
  onSave,
}: GalleryExtendedSettingsProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasData = data && Object.values(data).some((v) => v);

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Extended Settings</h3>
              <p className="text-xs text-gray-500 mt-1">Social, contact, SEO & legal</p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-sm font-medium text-accent-600 hover:text-accent-700 px-3 py-1.5 rounded-md hover:bg-accent-50"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)] px-6 py-4 space-y-4">
          {!hasData ? (
            <p className="text-sm text-gray-500 py-4">No settings configured yet.</p>
          ) : (
            <>
              {/* Social */}
              {(data?.instagramUrl || data?.facebookUrl || data?.xUrl || data?.linkedinUrl || data?.youtubeUrl || data?.whatsappUrl) && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Social Media</p>
                  <div className="space-y-2 text-sm">
                    {data?.instagramUrl && <p className="text-gray-700">📷 Instagram</p>}
                    {data?.facebookUrl && <p className="text-gray-700">f Facebook</p>}
                    {data?.xUrl && <p className="text-gray-700">𝕏 X</p>}
                    {data?.linkedinUrl && <p className="text-gray-700">in LinkedIn</p>}
                    {data?.youtubeUrl && <p className="text-gray-700">▶ YouTube</p>}
                    {data?.whatsappUrl && <p className="text-gray-700">💬 WhatsApp</p>}
                  </div>
                </div>
              )}

              {/* Contact */}
              {(data?.contactEmail || data?.phone || data?.addressLine) && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Contact</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    {data?.contactEmail && <p>📧 {data.contactEmail}</p>}
                    {data?.phone && <p>☎️ {data.phone}</p>}
                    {data?.addressLine && <p>📍 {data.addressLine}</p>}
                  </div>
                </div>
              )}

              {/* SEO */}
              {(data?.metaTitle || data?.metaDescription) && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">SEO</p>
                  <div className="space-y-1 text-xs text-gray-700">
                    {data?.metaTitle && <p className="truncate">📝 {data.metaTitle}</p>}
                    {data?.metaDescription && <p className="line-clamp-2">📄 {data.metaDescription}</p>}
                  </div>
                </div>
              )}

              {/* Legal */}
              {(data?.legalName || data?.timezone) && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Legal & Hours</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    {data?.legalName && <p>{data.legalName}</p>}
                    {data?.timezone && <p className="text-xs text-gray-600">{data.timezone}</p>}
                  </div>
                </div>
              )}

              {/* Announcement */}
              {data?.announcementEnabled && data?.announcementText && (
                <div className="border-t border-gray-100 pt-3 bg-blue-50 p-3 rounded-md">
                  <p className="text-xs font-semibold text-blue-700 mb-1">🔔 Announcement Active</p>
                  <p className="text-xs text-blue-900 line-clamp-2">{data.announcementText}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Drawer */}
      <GalleryExtendedDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={data}
        onSave={onSave}
      />
    </>
  );
}
