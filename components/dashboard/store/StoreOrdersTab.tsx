"use client";

import { useOrders } from "@/hooks/useOrders";
import type { ApiGallery } from "@/lib/types/models";

interface StoreOrdersTabProps {
  gallery: ApiGallery;
}

export default function StoreOrdersTab({ gallery }: StoreOrdersTabProps) {
  const { orders, isLoading, error, updateOrderStatus } = useOrders({ galleryId: gallery.id });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-success-100 text-success-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Órdenes ({orders.length})</h3>

      {error && (
        <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando órdenes...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <p>No hay órdenes aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-900">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-gray-900">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{order.customerEmail}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">€{order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as "processing" | "shipped" | "delivered")
                      }
                      className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="new">Nuevo</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
