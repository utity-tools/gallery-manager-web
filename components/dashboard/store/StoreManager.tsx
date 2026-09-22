"use client";

import { useState } from "react";
import { useGallery } from "@/hooks/useGallery";
import Tabs from "@/components/Tabs";
import StoreProductsTab from "@/components/dashboard/store/StoreProductsTab";
import StoreOrdersTab from "@/components/dashboard/store/StoreOrdersTab";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface StoreManagerProps {
  slug: string;
}

const STORE_TABS = [
  { id: "products", label: "Productos" },
  { id: "orders", label: "Órdenes" },
  { id: "inventory", label: "Inventario" },
  { id: "settings", label: "Configuración" },
];

export default function StoreManager({ slug: _slug }: StoreManagerProps) {
  const [activeTab, setActiveTab] = useState("products");
  const { gallery, isLoading, error } = useGallery();

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {isLoading && <p className="text-sm text-gray-500">Loading store...</p>}
        {error && <p className="text-sm text-danger-600">{error}</p>}

        {gallery && (
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="px-6 pt-6">
              <h1 className="mb-4 text-2xl font-semibold text-gray-900">Store Management</h1>
            </div>
            <Tabs tabs={STORE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="p-6">
              {activeTab === "products" && <StoreProductsTab gallery={gallery} />}
              {activeTab === "orders" && <StoreOrdersTab gallery={gallery} />}
              {activeTab === "inventory" && (
                <p className="text-sm text-gray-500">Inventario (en desarrollo)</p>
              )}
              {activeTab === "settings" && (
                <p className="text-sm text-gray-500">Configuración de tienda (en desarrollo)</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
