import { z } from "zod";

/**
 * z.coerce.number() on an empty string coerces to 0 before .optional() ever
 * runs, so a blank number input fails min/max validation instead of being
 * treated as unset. Strip "" to undefined first so blank really means blank.
 */
function optionalCoercedNumber(schema: z.ZodType<number, unknown>) {
  return z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    schema.optional()
  );
}

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const gallerySettingsSchema = z.object({
  title: z.string().min(1, "Gallery title is required"),
  description: z.string().max(2000, "Description is too long").optional().or(z.literal("")),
  isPublic: z.boolean(),
});

export type GallerySettingsFormValues = z.infer<typeof gallerySettingsSchema>;

export const galleryAboutSchema = z.object({
  aboutHeading: z.string().max(200, "Heading is too long").optional().or(z.literal("")),
  aboutText: z.string().max(3000, "Text is too long").optional().or(z.literal("")),
  aboutPhotoUrl: z.url("Enter a valid photo URL").optional().or(z.literal("")),
});

export type GalleryAboutFormValues = z.infer<typeof galleryAboutSchema>;

export const artworkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artistId: z.string().min(1, "Artist is required"),
  imageUrl: z.url("Enter a valid image URL"),
  description: z.string().max(4000, "Description is too long").optional().or(z.literal("")),
  year: optionalCoercedNumber(z.coerce.number().int().min(1000).max(new Date().getFullYear())),
  price: optionalCoercedNumber(z.coerce.number().nonnegative("Price cannot be negative")),
});

export type ArtworkFormInput = z.input<typeof artworkSchema>;
export type ArtworkFormValues = z.output<typeof artworkSchema>;

export const artistSchema = z.object({
  name: z.string().min(1, "Artist name is required").max(255),
  country: z.string().max(100).optional().or(z.literal("")),
  birthYear: optionalCoercedNumber(
    z.coerce.number().int().min(1000).max(new Date().getFullYear())
  ),
  bio: z.string().max(2000, "Bio is too long").optional().or(z.literal("")),
  photoUrl: z.url("Enter a valid photo URL").optional().or(z.literal("")),
  biographyHeading: z
    .string()
    .max(200, "Biography heading is too long")
    .optional()
    .or(z.literal("")),
  biographyText: z.string().max(3000, "Biography text is too long").optional().or(z.literal("")),
  biographyPhotoUrl: z.url("Enter a valid photo URL").optional().or(z.literal("")),
  featuredArtworkIds: z.array(z.string()).max(8, "Select at most 8 artworks").optional(),
});

export type ArtistFormInput = z.input<typeof artistSchema>;
export type ArtistFormValues = z.output<typeof artistSchema>;

export const showSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(4000, "Description is too long").optional().or(z.literal("")),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    venueName: z.string().max(255).optional().or(z.literal("")),
    address: z.string().max(255).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    country: z.string().max(100).optional().or(z.literal("")),
    coverImageUrl: z.url("Enter a valid image URL").optional().or(z.literal("")),
    isPublic: z.boolean(),
    artistIds: z.array(z.string()).optional(),
    artworkIds: z.array(z.string()).optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type ShowFormInput = z.input<typeof showSchema>;
export type ShowFormValues = z.output<typeof showSchema>;

// Gallery Settings — Branding
export const galleryBrandingSchema = z.object({
  logoUrl: z.url("Enter a valid logo URL").optional().or(z.literal("")),
  logoDarkUrl: z.url("Enter a valid dark mode logo URL").optional().or(z.literal("")),
});

export type GalleryBrandingFormValues = z.infer<typeof galleryBrandingSchema>;

// Gallery Settings — Social & Contact
const urlOptional = z.url("Enter a valid URL").optional().or(z.literal(""));

export const gallerySocialSchema = z.object({
  instagramUrl: urlOptional,
  facebookUrl: urlOptional,
  xUrl: urlOptional,
  whatsappUrl: urlOptional,
  youtubeUrl: urlOptional,
  linkedinUrl: urlOptional,
});

export type GallerySocialFormValues = z.infer<typeof gallerySocialSchema>;

export const galleryContactSchema = z.object({
  contactEmail: z.email("Enter a valid contact email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  addressLine: z.string().max(255).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
});

export type GalleryContactFormValues = z.infer<typeof galleryContactSchema>;

// Gallery Settings — SEO
export const gallerySEOSchema = z.object({
  metaTitle: z.string().max(60, "Meta title should be under 60 characters").optional().or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description should be under 160 characters")
    .optional()
    .or(z.literal("")),
  ogImageUrl: z.url("Enter a valid OG image URL").optional().or(z.literal("")),
});

export type GallerySEOFormValues = z.infer<typeof gallerySEOSchema>;

// Gallery Settings — Hours (JSON structure)
export const galleryHourSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "Enter time in HH:MM format"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Enter time in HH:MM format"),
});

export const galleryHoursSchema = z.record(
  z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  z.array(galleryHourSchema).nullable()
);

export type GalleryHoursFormValues = z.infer<typeof galleryHoursSchema>;

// Gallery Settings — Footer & Legal
export const galleryFooterSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  hoursNote: z.string().max(500, "Note is too long").optional().or(z.literal("")),
  googleMapsUrl: z.url("Enter a valid Google Maps URL").optional().or(z.literal("")),
  announcementText: z.string().max(500, "Announcement is too long").optional().or(z.literal("")),
  announcementUrl: z.url("Enter a valid announcement URL").optional().or(z.literal("")),
  announcementEnabled: z.boolean().optional(),
  legalName: z.string().max(255).optional().or(z.literal("")),
  taxId: z.string().max(50).optional().or(z.literal("")),
  privacyPolicyUrl: z.url("Enter a valid privacy policy URL").optional().or(z.literal("")),
});

export type GalleryFooterFormValues = z.infer<typeof galleryFooterSchema>;

// Combined Gallery Extended Settings
export const galleryExtendedSettingsSchema = z.object({
  ...galleryBrandingSchema.shape,
  ...gallerySocialSchema.shape,
  ...galleryContactSchema.shape,
  ...gallerySEOSchema.shape,
  ...galleryFooterSchema.shape,
  hoursJson: galleryHoursSchema.optional(),
});

export type GalleryExtendedSettingsFormValues = z.infer<typeof galleryExtendedSettingsSchema>;
