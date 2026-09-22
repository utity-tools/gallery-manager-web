"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import type { ApiProduct } from "@/lib/types/store";

interface ProductDetailProps {
  product: ApiProduct;
  slug: string;
}

export default function ProductDetail({ product, slug }: ProductDetailProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantes, setSelectedVariantes] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert("No hay suficiente stock");
      return;
    }

    addItem({
      productId: product.id,
      quantity,
      title: product.title,
      priceAtTime: product.price,
      variantes: selectedVariantes,
      imageUrl: product.imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div data-testid="product-detail-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div>
          {product.imageUrl && (
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl tracking-wide text-[color:var(--color-gallery-fg)]">
              {product.title.toUpperCase()}
            </h1>
            <p className="mt-2 text-2xl font-bold text-accent-500">€{product.price.toFixed(2)}</p>
            <p className="mt-2 text-sm text-[color:var(--color-gallery-fg)]/60">
              {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-900">Descripción</h2>
              <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Variantes */}
          {product.variantes && product.variantes.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900">Opciones</h3>
              {product.variantes.map((variant) => (
                <div key={variant.type}>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
                  </label>
                  <select
                    value={selectedVariantes[variant.type] || ""}
                    onChange={(e) =>
                      setSelectedVariantes((prev) => ({
                        ...prev,
                        [variant.type]: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    {variant.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Cantidad */}
          <div className="border-t border-gray-200 pt-6">
            <label className="mb-2 block text-xs font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), product.stock))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "✓ Agregado" : "Agregar al Carrito"}
            </button>
            <Link
              href={`/gallery/${slug}/store`}
              className="flex-1 border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
