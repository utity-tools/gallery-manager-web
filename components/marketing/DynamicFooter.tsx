import type { ApiGallery } from "@/lib/types/models";

interface DynamicFooterProps {
  gallery?: ApiGallery;
}

export default function DynamicFooter({ gallery }: DynamicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact */}
          {(gallery?.contactEmail || gallery?.phone || gallery?.addressLine) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Contact</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {gallery.contactEmail && (
                  <p>
                    <a href={`mailto:${gallery.contactEmail}`} className="hover:text-accent-600">
                      {gallery.contactEmail}
                    </a>
                  </p>
                )}
                {gallery.phone && <p>{gallery.phone}</p>}
                {gallery.addressLine && (
                  <div>
                    <p>{gallery.addressLine}</p>
                    {(gallery.city || gallery.postalCode || gallery.country) && (
                      <p>
                        {[gallery.postalCode, gallery.city, gallery.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hours */}
          {(gallery?.hours || gallery?.hoursNote) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Hours</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {gallery.hours && (
                  <>
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
                      (day) => {
                        const dayHours = gallery.hours?.[day as keyof typeof gallery.hours];
                        if (!dayHours) return null;
                        return (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}</span>
                            <span>
                              {Array.isArray(dayHours) && dayHours.length > 0
                                ? dayHours.map((h) => `${h.start}–${h.end}`).join(", ")
                                : "Closed"}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </>
                )}
                {gallery.hoursNote && <p className="mt-2 text-xs italic">{gallery.hoursNote}</p>}
              </div>
            </div>
          )}

          {/* Social */}
          {(gallery?.instagramUrl ||
            gallery?.facebookUrl ||
            gallery?.xUrl ||
            gallery?.linkedinUrl ||
            gallery?.youtubeUrl) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Follow</h4>
              <div className="mt-4 flex gap-3">
                {gallery.instagramUrl && (
                  <a
                    href={gallery.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent-600"
                    aria-label="Instagram"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.251-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                    </svg>
                  </a>
                )}
                {gallery.facebookUrl && (
                  <a
                    href={gallery.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent-600"
                    aria-label="Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {gallery.xUrl && (
                  <a
                    href={gallery.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent-600"
                    aria-label="X"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.693-5.829 6.693h-3.307l7.732-8.835L.424 2.25h6.679l4.632 6.142L17.383 2.25h.861zm-1.106 17.611h1.829L5.016 3.276H3.181l14.956 16.585z" />
                    </svg>
                  </a>
                )}
                {gallery.linkedinUrl && (
                  <a
                    href={gallery.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent-600"
                    aria-label="LinkedIn"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
                {gallery.youtubeUrl && (
                  <a
                    href={gallery.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-accent-600"
                    aria-label="YouTube"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Legal */}
          {(gallery?.legalName || gallery?.privacyPolicyUrl || gallery?.googleMapsUrl) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {gallery.legalName && <p>{gallery.legalName}</p>}
                {gallery.googleMapsUrl && (
                  <p>
                    <a href={gallery.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">
                      Location
                    </a>
                  </p>
                )}
                {gallery.privacyPolicyUrl && (
                  <p>
                    <a href={gallery.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} {gallery?.legalName || gallery?.title || "Gallery"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
