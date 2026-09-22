import Link from "next/link";

interface QuickActionsProps {
  slug: string;
  onAddArtwork: () => void;
}

export default function QuickActions({ slug, onAddArtwork }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button type="button" onClick={onAddArtwork} className="btn-primary">
        + Add Artwork
      </button>
      <Link
        href="/dashboard/gallery-settings"
        className="text-sm text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
      >
        Gallery Settings
      </Link>
      <Link
        href={`/gallery/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
      >
        View Public Gallery →
      </Link>
    </div>
  );
}
