"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

interface CartProps {
  slug: string;
}

export default function Cart({ slug }: CartProps) {
  const { items, total, count, removeItem, updateQuantity } = useCart();

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 max-h-96 w-80 overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <h3 className="font-semibold text-gray-900">Carrito ({count})</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={`${item.productId}-${JSON.stringify(item.variantes)}`} className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-600">€{item.priceAtTime.toFixed(2)}</p>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="w-12 rounded border border-gray-300 text-center text-xs"
                />
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-danger-600 hover:text-danger-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="font-bold text-accent-500">€{total.toFixed(2)}</span>
        </div>
        <Link
          href={`/gallery/${slug}/checkout`}
          className="block w-full bg-accent-500 px-4 py-2 text-center text-xs font-semibold text-white hover:opacity-80"
        >
          Ir a Pagar
        </Link>
      </div>
    </div>
  );
}
