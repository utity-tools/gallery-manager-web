"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/types/store";

const CART_KEY = "gallery-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (_err) {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (_err) {
      // Ignore storage errors
    }
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          JSON.stringify(i.variantes) === JSON.stringify(item.variantes)
      );

      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }

      return [...prev, item];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clear = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);

  return {
    items,
    isLoaded,
    total,
    count: items.length,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}
