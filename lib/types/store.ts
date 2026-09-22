/**
 * Store/eCommerce related types
 * Synchronized with backend Prisma models
 */

export type ProductCategory = "print" | "photo" | "illustration" | "merchandise";

export interface ProductVariant {
  type: "size" | "material" | "acabado";
  options: string[];
}

export interface ApiProduct {
  id: string;
  galleryId: string;
  title: string;
  description?: string;
  imageUrl: string;
  price: number;
  category: ProductCategory;
  stock: number;
  sku: string;
  variantes?: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
  id: string;
  galleryId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "new" | "processing" | "shipped" | "delivered";
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  stripePaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  title: string;
  priceAtTime: number;
  variantes?: Record<string, string>;
}

export interface CartItem extends OrderItem {
  imageUrl?: string;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  imageUrl: string;
  price: number;
  category: ProductCategory;
  stock: number;
  sku: string;
  variantes?: ProductVariant[];
  isActive?: boolean;
}

export interface CreateOrderInput {
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  stripePaymentId?: string;
}
