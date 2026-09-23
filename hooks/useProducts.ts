import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";
import type { ApiProduct, CreateProductInput } from "@/lib/types/store";

interface UseProductsOptions {
  galleryId?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export function useProducts({
  galleryId,
  page = 1,
  limit = 12,
  category,
}: UseProductsOptions = {}) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    if (!galleryId) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await getProducts(galleryId, page, limit);

      let filtered = result.items || [];
      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }

      setProducts(filtered);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      setError(message);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [galleryId, page, limit, category]);

  useEffect(() => {
    if (!session?.user?.id || !galleryId) return;
    fetchProducts();
  }, [session?.user?.id, galleryId, page, limit, category]);

  const addProduct = useCallback(
    async (input: CreateProductInput) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const product = await createProduct(galleryId, input);
        setProducts((prev) => [...prev, product]);
        setTotal((prev) => prev + 1);
        return product;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to create product");
      }
    },
    [galleryId]
  );

  const updateProductData = useCallback(
    async (productId: string, input: Partial<CreateProductInput>) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        const updated = await updateProduct(galleryId, productId, input);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updated : p))
        );
        return updated;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to update product");
      }
    },
    [galleryId]
  );

  const removeProduct = useCallback(
    async (productId: string) => {
      if (!galleryId) throw new Error("Gallery not found");
      try {
        await deleteProduct(galleryId, productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setTotal((prev) => Math.max(0, prev - 1));
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
    total,
    totalPages,
    addProduct,
    updateProduct: updateProductData,
    deleteProduct: removeProduct,
    mutate: fetchProducts,
  };
}
