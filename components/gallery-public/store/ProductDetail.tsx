"use client";

interface ProductDetailProps {
  slug: string;
  productId: string;
}

export default function ProductDetail({ slug: _slug, productId: _productId }: ProductDetailProps) {
  return (
    <div data-testid="product-detail-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* TODO: Product detail + variantes + add to cart */}
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>Detalle de producto (en desarrollo)</p>
      </div>
    </div>
  );
}
