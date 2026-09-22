import ArtistDetailHero from "@/components/gallery-public/ArtistDetailHero";
import ArtistDetailContent from "@/components/gallery-public/ArtistDetailContent";
import type { ArtistDetail } from "@/lib/types/models";

interface ArtistDetailViewProps {
  slug: string;
  artist: ArtistDetail;
}

export default function ArtistDetailView({ slug, artist }: ArtistDetailViewProps) {
  const artworksForHero =
    artist.featuredArtworks && artist.featuredArtworks.length > 0
      ? artist.featuredArtworks
      : (artist.artworks ?? []);

  const slides = artworksForHero
    .filter((artwork) => Boolean(artwork.imageUrl))
    .map((artwork) => ({ url: artwork.imageUrl!, title: artwork.title }));

  if (slides.length === 0) {
    const fallbackPhoto = artist.biographyPhotoUrl || artist.photoUrl;
    if (fallbackPhoto) {
      slides.push({ url: fallbackPhoto, title: "" });
    }
  }

  return (
    <div data-testid="artist-detail-page">
      <ArtistDetailHero
        slug={slug}
        artistName={artist.name}
        country={artist.country}
        birthYear={artist.birthYear}
        slides={slides}
      />
      <ArtistDetailContent artist={artist} slug={slug} />
    </div>
  );
}
