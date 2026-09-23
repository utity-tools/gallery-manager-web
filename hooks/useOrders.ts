import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrders, updateOrderStatus } from "@/lib/api";
import type { ApiOrder } from "@/lib/types/store";

interface UseOrdersOptions {
  galleryId?: string;
  page?: number;
  limit?: number;
}

export function useOrders({
  galleryId,
  page = 1,
  limit = 12,
}: UseOrdersOptions = {}) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    if (!galleryId) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await getOrders(galleryId, page, limit);
      setOrders(result.items || []);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [galleryId, page, limit]);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;
    fetchOrders();
  }, [session?.user?.id, galleryId, page, limit]);

  const updateStatus = useCallback(
    async (
      orderId: string,
      status: "processing" | "shipped" | "delivered"
    ) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const updated = await updateOrderStatus(galleryId, orderId, status);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
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
    total,
    totalPages,
    updateOrderStatus: updateStatus,
    mutate: fetchOrders,
  };
}
