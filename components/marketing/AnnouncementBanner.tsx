import type { ApiGallery } from "@/lib/types/models";

interface AnnouncementBannerProps {
  gallery?: ApiGallery;
}

export default function AnnouncementBanner({ gallery }: AnnouncementBannerProps) {
  if (!gallery?.announcementEnabled || !gallery.announcementText) {
    return null;
  }

  return (
    <div className="bg-accent-50 px-4 py-3 text-center text-sm text-accent-900 border-b border-accent-200">
      {gallery.announcementUrl ? (
        <a href={gallery.announcementUrl} className="hover:underline font-medium">
          {gallery.announcementText}
        </a>
      ) : (
        <p>{gallery.announcementText}</p>
      )}
    </div>
  );
}
