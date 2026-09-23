import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { ApiProduct, CreateProductInput } from "@/lib/types/store";

interface UseProductsOptions {
  galleryId?: string;
  category?: string;
}

export function useProducts({ galleryId, category }: UseProductsOptions = {}) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!galleryId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<{ success: boolean; data: { items: ApiProduct[] } }>(
        `/galleries/${galleryId}/products`,
        { params: { ...(category && { category }) } }
      );
      setProducts(response.data.data?.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [galleryId, category]);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;
    fetchProducts();
  }, [session?.user?.id, galleryId, fetchProducts]);

  const createProduct = useCallback(
    async (input: CreateProductInput) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const response = await api.post<{ success: boolean; data: ApiProduct }>(
          `/galleries/${galleryId}/products`,
          input
        );
        const newProduct = response.data.data;
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to create product");
      }
    },
    [galleryId]
  );

  const updateProduct = useCallback(
    async (productId: string, input: Partial<CreateProductInput>) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const response = await api.put<{ success: boolean; data: ApiProduct }>(
          `/galleries/${galleryId}/products/${productId}`,
          input
        );
        const updated = response.data.data;
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
        return updated;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to update product");
      }
    },
    [galleryId]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        await api.delete(`/galleries/${galleryId}/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to delete product");
      }
    },
    [galleryId]
  );

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    mutate: fetchProducts,
  };
}
