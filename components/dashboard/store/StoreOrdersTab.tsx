"use client";

import type { ApiGallery } from "@/lib/types/models";

interface StoreOrdersTabProps {
  gallery: ApiGallery;
}

export default function StoreOrdersTab({ gallery: _gallery }: StoreOrdersTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Órdenes</h3>

      {/* TODO: Orders grid + status update */}
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>Historial de órdenes (en desarrollo)</p>
      </div>
    </div>
  );
}
