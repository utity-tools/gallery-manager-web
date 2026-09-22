"use client";

import { useEffect, useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import { useArtworks } from "@/hooks/useArtworks";
import { useShows } from "@/hooks/useShows";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Plus, Users, Calendar, TrendingUp } from "lucide-react";

interface DashboardOverviewProps {
  slug: string;
}

const statClass = "rounded-lg border border-gray-200 bg-white p-6";
const statNumberClass = "text-3xl font-bold text-gray-900";
const statLabelClass = "mt-2 text-sm text-gray-600";

export default function DashboardOverview({ slug }: DashboardOverviewProps) {
  const { gallery, isLoading: galleryLoading } = useGallery();
  const { artworks, total: artworkCount, isLoading: artworksLoading } = useArtworks({
    galleryId: gallery?.id,
    limit: 100,
  });
  const { shows } = useShows({
    galleryId: gallery?.id,
    limit: 100,
  });

  const [upcomingShows, setUpcomingShows] = useState(shows.filter((s) => s.status === "upcoming").slice(0, 3));
  const [artistCount, setArtistCount] = useState(0);
  const [recentArtworks, setRecentArtworks] = useState(artworks.slice(0, 5));

  useEffect(() => {
    setRecentArtworks(artworks.slice(0, 5));
  }, [artworks]);

  useEffect(() => {
    setUpcomingShows(shows.filter((s) => s.status === "upcoming").slice(0, 3));
  }, [shows]);

  // Fetch artist count
  useEffect(() => {
    if (!gallery?.id) return;

    fetch(`/api/galleries/${gallery.id}/artists`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const artists = Array.isArray(data) ? data : data.data || [];
        setArtistCount(artists.length);
      })
      .catch(() => {});
  }, [gallery?.id]);

  if (galleryLoading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  if (!gallery) {
    return <div className="text-danger-600">Gallery not found</div>;
  }

  const withPrice = artworks.filter((a) => a.price).length;
  const avgPrice =
    withPrice > 0 ? artworks.reduce((sum, a) => sum + (parseFloat(a.price as string) || 0), 0) / withPrice : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{gallery.title}</h1>
        {gallery.description && <p className="mt-2 text-gray-600">{gallery.description}</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className={statClass}>
          <div className="flex items-start justify-between">
            <div>
              <p className={statNumberClass}>{artworksLoading ? "—" : artworkCount}</p>
              <p className={statLabelClass}>Artworks</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className={statClass}>
          <p className={statNumberClass}>{artistCount}</p>
          <p className={statLabelClass}>Artists</p>
        </div>

        <div className={statClass}>
          <p className={statNumberClass}>{shows.length}</p>
          <p className={statLabelClass}>Exhibitions</p>
        </div>

        <div className={statClass}>
          <p className={statNumberClass}>${avgPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
          <p className={statLabelClass}>Avg. Price</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href={`/dashboard/${slug}/artworks/new`}
          className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-white hover:bg-accent-600 text-sm font-medium"
        >
          <Plus size={16} />
          Add Artwork
        </Link>
        <Link
          href={`/dashboard/${slug}/artists`}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          <Users size={16} />
          Artists
        </Link>
        <Link
          href={`/dashboard/${slug}/shows`}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          <Calendar size={16} />
          Exhibitions
        </Link>
        <Link
          href="/dashboard/gallery-settings"
          className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm font-medium"
        >
          Settings
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Exhibitions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar size={20} className="text-accent-600" />
            Upcoming Exhibitions
          </h2>
          {upcomingShows.length > 0 ? (
            <div className="mt-4 space-y-3">
              {upcomingShows.map((show) => (
                <Link
                  key={show.id}
                  href={`/dashboard/${slug}/shows`}
                  className="block border-l-4 border-accent-500 pl-4 py-2 hover:bg-gray-50 rounded-r"
                >
                  <p className="font-medium text-gray-900">{show.title}</p>
                  <p className="text-sm text-gray-600">
                    {show.startDate &&
                      new Date(show.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </p>
                  {show.venueName && <p className="text-xs text-gray-500">{show.venueName}</p>}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No upcoming exhibitions</p>
          )}
          <Link
            href={`/dashboard/${slug}/shows`}
            className="mt-4 block text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            View all exhibitions →
          </Link>
        </div>

        {/* Recently Added Artworks */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Added</h2>
          {recentArtworks.length > 0 ? (
            <div className="space-y-2">
              {recentArtworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/dashboard/${slug}/artworks/${artwork.id}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition"
                >
                  {artwork.imageUrl ? (
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                      <AlertCircle size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{artwork.title}</p>
                    {artwork.price && <p className="text-xs text-accent-600">${artwork.price}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No artworks yet</p>
          )}
          <Link
            href={`/dashboard/${slug}/artworks`}
            className="mt-4 block text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            View all artworks →
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {artworkCount === 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-blue-600" size={24} />
          <h3 className="font-semibold text-blue-900">No artworks yet</h3>
          <p className="mt-1 text-sm text-blue-700">Start by adding your first artwork to populate your gallery.</p>
          <Link
            href={`/dashboard/${slug}/artworks/new`}
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Your First Artwork
          </Link>
        </div>
      )}
    </div>
  );
}
