import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { ApiOrder } from "@/lib/types/store";

interface UseOrdersOptions {
  galleryId?: string;
}

export function useOrders({ galleryId }: UseOrdersOptions = {}) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!galleryId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { items: ApiOrder[] } }>(
        `/galleries/${galleryId}/orders`
      );
      setOrders(response.data.data?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [galleryId]);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;
    fetchOrders();
  }, [session?.user?.id, galleryId, fetchOrders]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: "processing" | "shipped" | "delivered") => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const response = await api.put<{ success: boolean; data: ApiOrder }>(
          `/galleries/${galleryId}/orders/${orderId}`,
          { orderStatus: status }
        );
        const updated = response.data.data;
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        return updated;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to update order");
      }
    },
    [galleryId]
  );

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
    mutate: fetchOrders,
  };
}
