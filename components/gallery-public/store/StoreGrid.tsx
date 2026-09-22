"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiProduct } from "@/lib/types/store";

interface StoreGridProps {
  slug: string;
  products?: ApiProduct[];
}

const CATEGORIES = ["print", "photo", "illustration", "merchandise"];

export default function StoreGrid({ slug, products = [] }: StoreGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return p.isActive && p.stock > 0;
  });

  return (
    <div data-testid="store-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">STORE</h1>
        <p className="mt-2 text-sm text-[color:var(--color-gallery-fg)]/60">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""} disponibles
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {/* Categories */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Categoría</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left text-xs ${
                    selectedCategory === null ? "font-semibold text-accent-500" : "text-gray-600"
                  }`}
                >
                  Todas
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-xs ${
                      selectedCategory === cat ? "font-semibold text-accent-500" : "text-gray-600"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Precio</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">
                  €{priceRange[0]} - €{priceRange[1]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-gray-200 p-12 text-center text-gray-500">
              <p>No hay productos disponibles con estos filtros</p>
            </div>
          ) : (
            <div className="grid auto-rows-[250px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/gallery/${slug}/store/${product.id}`}
                  data-testid={`product-card-${product.id}`}
                  className="group relative overflow-hidden rounded-lg bg-gray-100"
                >
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

                  <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-black/0 p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-xs font-semibold text-white">{product.title.toUpperCase()}</p>
                    <p className="mt-1 text-sm font-bold text-white">€{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
