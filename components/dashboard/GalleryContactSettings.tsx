"use client";

import type { ApiGallery } from "@/lib/types/models";

interface GalleryContactSettingsProps {
  gallery: ApiGallery;
}

export default function GalleryContactSettings({ gallery }: GalleryContactSettingsProps) {
  const contactInfo = [
    { label: "Email", value: gallery.contactEmail, icon: "✉️" },
    { label: "Phone", value: gallery.phone, icon: "📞" },
    { label: "Address", value: gallery.addressLine, icon: "📍" },
    { label: "Instagram", value: gallery.instagramUrl, icon: "📱" },
    { label: "Facebook", value: gallery.facebookUrl, icon: "f" },
  ];

  const hasContactInfo = contactInfo.some((item) => item.value);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Contact Information</h3>
        <p className="mt-1 text-sm text-gray-600">Publicly displayed on your contact page.</p>
      </div>

      {hasContactInfo ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
          {contactInfo.map(
            (item) =>
              item.value && (
                <div key={item.label} className="text-xs">
                  <p className="font-semibold text-gray-700">{item.icon} {item.label}</p>
                  <p className="text-gray-600 break-all">{item.value}</p>
                </div>
              )
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs text-gray-600">No contact information added yet.</p>
        </div>
      )}

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-semibold text-blue-900 mb-2">📧 PUBLIC CONTACT FORM</p>
        <p className="text-xs text-blue-800">
          Visitors can send messages via the contact page at <code className="font-mono">/gallery/{gallery.id}/contact</code>.
          Messages are sent to your email address via rate-limited endpoint.
        </p>
      </div>

      <p className="text-xs text-gray-500">
        Manage contact details in <strong>Gallery Info</strong> section above.
      </p>
    </div>
  );
}
