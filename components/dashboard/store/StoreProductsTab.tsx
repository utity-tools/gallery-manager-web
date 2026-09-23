"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { type ProductFormValues } from "@/lib/validation";
import type { ApiGallery } from "@/lib/types/models";
import type { ApiProduct as StoreProduct } from "@/lib/types/store";
import ProductModal from "@/components/dashboard/store/ProductModal";

interface StoreProductsTabProps {
  gallery: ApiGallery;
}

export default function StoreProductsTab({ gallery }: StoreProductsTabProps) {
  const { products, isLoading, error, addProduct, deleteProduct } = useProducts({ galleryId: gallery.id });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoreProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const handleCreateProduct = async (values: ProductFormValues) => {
    try {
      setCreationError(null);
      await addProduct(values);
      setIsModalOpen(false);
    } catch (err) {
      setCreationError(err instanceof Error ? err.message : "Failed to create product");
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setCreationError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Productos ({products.length})</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-white hover:bg-accent-600 text-sm font-medium"
        >
          <Plus size={16} />
          Agregar Producto
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
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-xs text-accent-600 hover:text-accent-700"
                    >
                      Editar
                    </button>
                    <span className="mx-2 text-gray-300">|</span>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="text-xs text-danger-600 hover:text-danger-700"
                    >
                      Eliminar
                    </button>
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

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Eliminar producto</h3>
            <p className="mt-2 text-sm text-gray-600">
              ¿Está seguro que desea eliminar <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-white hover:bg-danger-700 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
