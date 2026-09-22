"use client";

import { useState, useCallback, useEffect } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useArtworks } from "@/hooks/useArtworks";
import Tabs from "@/components/Tabs";
import GalleryInfo from "@/components/dashboard/GalleryInfo";
import GalleryAboutUs from "@/components/dashboard/GalleryAboutUs";
import GalleryArtistsSettings from "@/components/dashboard/GalleryArtistsSettings";
import GalleryBrandingSettings from "@/components/dashboard/gallery-settings/GalleryBrandingSettings";
import GalleryExtendedSettings from "@/components/dashboard/gallery-settings/GalleryExtendedSettings";
import GalleryHomeSettings from "@/components/dashboard/gallery-settings/GalleryHomeSettings";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface GallerySettingsManagerProps {
  slug: string;
}

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error';
}

const PAGES_TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About us" },
  { id: "artists", label: "Artists" },
  { id: "artworks", label: "Artworks" },
  { id: "contact", label: "Contact" },
];

export default function GallerySettingsManager({ slug }: GallerySettingsManagerProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activePage, setActivePage] = useState("about");
  const { gallery, isLoading, error, updateGalleryData } = useGallery();
  const { total, error: artworksError } = useArtworks({ galleryId: gallery?.id, limit: 1 });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // Surface errors as toasts immediately
  useEffect(() => {
    if (error) showToast(error, 'error');
    if (artworksError) showToast(artworksError, 'error');
  }, [error, artworksError, showToast]);

  const handleSave = async (input: Parameters<typeof updateGalleryData>[0]) => {
    await updateGalleryData(input);
    showToast("Gallery settings saved");
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {isLoading && <p className="text-sm text-gray-500">Loading gallery...</p>}
        {error && <p className="text-sm text-danger-600">{error}</p>}

        {gallery && (
          <>
            {/* Gallery Info & Pages */}
            <div className="grid gap-6 lg:grid-cols-10">
              <div className="space-y-6 lg:col-span-7">
                <GalleryInfo gallery={gallery} slug={slug} artworkCount={total} onSave={handleSave} />

                {/* Pages Section */}
                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="px-6 pt-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Pages</h2>
                  </div>
                  <Tabs tabs={PAGES_TABS} activeTab={activePage} onTabChange={setActivePage} />
                  <div className="p-6">
                    {activePage === "about" && <GalleryAboutUs gallery={gallery} onSave={handleSave} />}
                    {activePage === "home" && (
                      <GalleryHomeSettings
                        heroArtworkIds={gallery.heroArtworkIds || []}
                        onSave={async (ids) => {
                          await handleSave({ heroArtworkIds: ids });
                        }}
                      />
                    )}
                    {activePage === "artists" && <GalleryArtistsSettings gallery={gallery} />}
                    {activePage === "artworks" && (
                      <p className="text-sm text-gray-500">Artworks page settings coming soon</p>
                    )}
                    {activePage === "contact" && (
                      <p className="text-sm text-gray-500">Contact page settings coming soon</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="sticky top-20 space-y-6">
                  <GalleryBrandingSettings
                    logoUrl={gallery.logoUrl}
                    logoDarkUrl={gallery.logoDarkUrl}
                    onSave={handleSave}
                  />
                  <GalleryExtendedSettings data={gallery} onSave={handleSave} />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-md px-4 py-2 text-sm text-white shadow-lg ${
                toast.type === 'error' ? 'bg-danger-600' : 'bg-success-600'
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
