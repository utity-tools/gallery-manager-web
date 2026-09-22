"use client";

import { useState } from "react";
import type { ApiGallery } from "@/lib/types/models";

interface StoreProductsTabProps {
  gallery: ApiGallery;
}

export default function StoreProductsTab({ gallery: _gallery }: StoreProductsTabProps) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-block bg-accent-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-80"
        >
          + Agregar producto
        </button>
      </div>

      {/* TODO: Products grid + CRUD form */}
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>Gestión de productos (en desarrollo)</p>
      </div>
    </div>
  );
}
