"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import type { ApiArtist } from "@/lib/types/models";

export type ArtworksFilterValue = "all" | "has" | "empty";

interface ArtistsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterCountry: string;
  onCountryChange: (value: string) => void;
  filterArtworks: ArtworksFilterValue;
  onArtworksChange: (value: ArtworksFilterValue) => void;
  artists: ApiArtist[];
  onAddClick: () => void;
}

export default function ArtistsFilter({
  search,
  onSearchChange,
  filterCountry,
  onCountryChange,
  filterArtworks,
  onArtworksChange,
  artists,
  onAddClick,
}: ArtistsFilterProps) {
  const countries = useMemo(() => {
    const unique = new Set(artists.map((a) => a.country).filter(Boolean) as string[]);
    return Array.from(unique).sort();
  }, [artists]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search artists..."
          className="w-full min-w-[220px] rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
      </div>

      <select
        value={filterCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        <option value="all">All countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        value={filterArtworks}
        onChange={(e) => onArtworksChange(e.target.value as ArtworksFilterValue)}
        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
      >
        <option value="all">All artworks</option>
        <option value="has">Has artworks</option>
        <option value="empty">No artworks</option>
      </select>

      <button type="button" onClick={onAddClick} className="btn-primary ml-auto">
        + Add Artist
      </button>
    </div>
  );
}
