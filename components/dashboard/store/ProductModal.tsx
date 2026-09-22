"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/lib/validation";
import type { ApiError } from "@/lib/types/models";

interface ProductModalProps {
  isOpen: boolean;
  galleryId: string;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500";

export default function ProductModal({ isOpen, galleryId, onClose, onSubmit }: ProductModalProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      price: 0,
      category: "print",
      stock: 0,
      sku: "",
    },
  });

  const handleClose = () => {
    reset();
    setFormError(null);
    onClose();
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      setFormError(null);
      await onSubmit(values);
      handleClose();
    } catch (err) {
      const apiError = err as ApiError;
      setFormError(apiError.message || "Failed to create product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Crear Producto</h2>

        {formError && (
          <div className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Nombre</label>
            <input
              type="text"
              placeholder="Guernica Print"
              {...register("title")}
              className={inputClass}
            />
            {errors.title && <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Descripción</label>
            <textarea
              placeholder="High-quality print..."
              {...register("description")}
              className={`${inputClass} resize-none`}
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-danger-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">URL de Imagen</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("imageUrl")}
              className={inputClass}
            />
            {errors.imageUrl && <p className="mt-1 text-xs text-danger-600">{errors.imageUrl.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">Precio (€)</label>
              <input
                type="number"
                placeholder="49.99"
                step="0.01"
                min="0"
                {...register("price")}
                className={inputClass}
              />
              {errors.price && <p className="mt-1 text-xs text-danger-600">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">Stock</label>
              <input
                type="number"
                placeholder="100"
                min="0"
                {...register("stock")}
                className={inputClass}
              />
              {errors.stock && <p className="mt-1 text-xs text-danger-600">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">Categoría</label>
              <select {...register("category")} className={inputClass}>
                <option value="print">Print</option>
                <option value="photo">Fotografía</option>
                <option value="illustration">Ilustración</option>
                <option value="merchandise">Merchandise</option>
              </select>
              {errors.category && <p className="mt-1 text-xs text-danger-600">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">SKU</label>
              <input
                type="text"
                placeholder="GUERNICA-001"
                {...register("sku")}
                className={inputClass}
              />
              {errors.sku && <p className="mt-1 text-xs text-danger-600">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
