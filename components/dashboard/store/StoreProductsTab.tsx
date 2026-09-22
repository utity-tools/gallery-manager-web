"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { type ProductFormValues } from "@/lib/validation";
import type { ApiGallery } from "@/lib/types/models";
import ProductModal from "@/components/dashboard/store/ProductModal";

interface StoreProductsTabProps {
  gallery: ApiGallery;
}

export default function StoreProductsTab({ gallery }: StoreProductsTabProps) {
  const { products, isLoading, error, createProduct } = useProducts({ galleryId: gallery.id });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const handleCreateProduct = async (values: ProductFormValues) => {
    try {
      setCreationError(null);
      await createProduct(values);
      setIsModalOpen(false);
    } catch (err) {
      setCreationError(err instanceof Error ? err.message : "Failed to create product");
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Productos ({products.length})</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-block bg-accent-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-80"
        >
          + Agregar Producto
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {creationError && (
        <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
          <p className="text-sm">{creationError}</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <p>No hay productos. ¡Crea uno para empezar!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Precio</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">SKU</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{product.title}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-gray-600">€{product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        product.stock < 5 ? "bg-warning-100 text-warning-800" : "bg-success-100 text-success-800"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.sku}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-accent-600 hover:text-accent-700">Editar</button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button className="text-xs text-danger-600 hover:text-danger-700">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
