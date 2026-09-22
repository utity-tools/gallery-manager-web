"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import type { Artwork } from "@/lib/types/models";

interface ArtworksFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterArtist: string;
  onArtistChange: (value: string) => void;
  filterYear: string;
  onYearChange: (value: string) => void;
  artworks: Artwork[];
  onAddClick: () => void;
}

export default function ArtworksFilter({
  search,
  onSearchChange,
  filterArtist,
  onArtistChange,
  filterYear,
  onYearChange,
  artworks,
  onAddClick,
}: ArtworksFilterProps) {
  const uniqueArtists = useMemo(() => {
    const byId = new Map<string, string>();
    for (const artwork of artworks) {
      if (artwork.artist?.id) {
        byId.set(artwork.artist.id, artwork.artist.name);
      }
    }
    return Array.from(byId, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [artworks]);

  const uniqueYears = useMemo(() => {
    const years = new Set(
      artworks.map((a) => a.year).filter((year): year is number => Boolean(year))
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [artworks]);

  const hasActiveFilters = search !== "" || filterArtist !== "all" || filterYear !== "all";

  const handleReset = () => {
    onSearchChange("");
    onArtistChange("all");
    onYearChange("all");
  };

  return (
    <div data-testid="artworks-filter" className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          data-testid="search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search artworks..."
          className="w-full min-w-[220px] rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>

      <select
        data-testid="filter-artist"
        value={filterArtist}
        onChange={(e) => onArtistChange(e.target.value)}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        <option value="all">All artists</option>
        {uniqueArtists.map((artist) => (
          <option key={artist.id} value={artist.id}>
            {artist.name}
          </option>
        ))}
      </select>

      <select
        data-testid="filter-year"
        value={filterYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        <option value="all">All years</option>
        {uniqueYears.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
        >
          Reset
        </button>
      )}

      <button type="button" data-testid="add-artwork-btn" onClick={onAddClick} className="btn-primary ml-auto">
        + Add Artwork
      </button>
    </div>
  );
}
