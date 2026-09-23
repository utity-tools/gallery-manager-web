export interface ApiUser {
  id: string;
  email: string;
  name: string;
  slug: string;
}

export interface GalleryHours {
  start: string;
  end: string;
}

export type GalleryHoursMap = Partial<Record<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday", GalleryHours[] | null>>;

export interface ApiGallery {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  isPublic: boolean;
  theme?: string;
  aboutHeading?: string;
  aboutText?: string;
  aboutPhotoUrl?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  contactEmail?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  xUrl?: string;
  whatsappUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  googleMapsUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  timezone?: string;
  hours?: GalleryHoursMap;
  hoursNote?: string;
  legalName?: string;
  taxId?: string;
  privacyPolicyUrl?: string;
  announcementText?: string;
  announcementUrl?: string;
  announcementEnabled?: boolean;
  heroArtworkIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/** The minimal shape embedded on an artwork response (`artwork.artist`). */
export interface ArtistRef {
  id: string;
  name: string;
  slug: string;
}

/** Full artist record, as returned by GET/POST/PUT /api/galleries/:id/artists and /api/artists/:id. */
export interface ApiArtist {
  id: string;
  galleryId: string;
  name: string;
  slug: string;
  country?: string;
  birthYear?: number;
  bio?: string;
  photoUrl?: string;
  artworkCount: number;
  exhibitionCount?: number;
  artfairCount?: number;
  createdAt: string;
  updatedAt: string;
}

/** Returned by POST/GET /api/artists/:id/exhibitions. */
export interface Exhibition {
  id: string;
  artistId: string;
  title: string;
  venue?: string;
  country?: string;
  year?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Returned by POST/GET /api/artists/:id/artfairs — note `name`, not `title`, and no venue/description. */
export interface ArtFair {
  id: string;
  artistId: string;
  name: string;
  country?: string;
  year?: number;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/artists/:id adds CV, biography extras, and linked-record arrays on top of the base record. */
export interface ArtistDetail extends ApiArtist {
  cv?: string;
  biographyHeading?: string;
  biographyText?: string;
  biographyPhotoUrl?: string;
  artworks?: ApiArtwork[];
  featuredArtworks?: ApiArtwork[];
  exhibitions?: Exhibition[];
  artFairs?: ArtFair[];
}

export type Artist = ApiArtist;

export interface ArtistInput {
  name: string;
  country?: string;
  birthYear?: number;
  bio?: string;
  photoUrl?: string;
  biographyHeading?: string;
  biographyText?: string;
  biographyPhotoUrl?: string;
  featuredArtworkIds?: string[];
}

/**
 * Reads still carry a legacy `artistName` string on some rows from before the
 * Artist entity existed; writes go through `artistId` now (see ArtworkInput).
 * Always read the display name via `getArtistName()` below, never either
 * field directly.
 */
export interface ApiArtwork {
  id: string;
  galleryId: string;
  title: string;
  artistName?: string;
  artistId?: string;
  artist?: ArtistRef;
  year?: number | null;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  isPublic?: boolean;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Single source of truth for displaying an artwork's artist name. */
export function getArtistName(artwork: ApiArtwork): string {
  return artwork.artist?.name ?? artwork.artistName ?? "Unknown artist";
}

/** Gallery merged with a client-computed artwork count. */
export interface Gallery extends ApiGallery {
  artworkCount: number;
}

export type Artwork = ApiArtwork;

/**
 * Payload for creating/editing an artwork. The backend requires imageUrl and
 * artistId at creation time (validated), so both stay required here even
 * though a persisted ApiArtwork reads them as optional for defensive
 * rendering (legacy rows, or a future backend relaxing the constraint).
 */
export interface ArtworkInput {
  title: string;
  artistId: string;
  imageUrl: string;
  description?: string;
  price?: number;
  year?: number;
}

export type GalleryInput = Partial<Omit<ApiGallery, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export type ArtworksPage = PaginatedResponse<ApiArtwork>;

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export interface DashboardState {
  gallery: Gallery | null;
  artworks: Artwork[];
  isLoading: boolean;
  error: string | null;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export type ShowStatus = "upcoming" | "current" | "past" | null;

interface ShowBase {
  id: string;
  galleryId: string;
  title: string;
  slug: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venueName?: string;
  address?: string;
  city?: string;
  country?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  /** Computed server-side from startDate/endDate vs. now; null when no dates are set. */
  status: ShowStatus;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/galleries/:id/shows and GET /api/public/galleries/:slug/shows — light list DTO. */
export interface ApiShow extends ShowBase {
  artistNames: string[];
  artworkCount: number;
}

/** GET/POST/PUT /api/shows/:id (and create) — full detail DTO with linked records. */
export interface ShowDetail extends ShowBase {
  artists: ApiArtist[];
  artworks: (ApiArtwork & { showPosition: number })[];
}

export interface ShowInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venueName?: string;
  address?: string;
  city?: string;
  country?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
  artistIds?: string[];
  artworkIds?: string[];
}
