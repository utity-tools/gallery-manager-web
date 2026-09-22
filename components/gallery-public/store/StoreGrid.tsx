"use client";

interface StoreGridProps {
  slug: string;
}

export default function StoreGrid({ slug: _slug }: StoreGridProps) {
  return (
    <div data-testid="store-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">STORE</h1>
        <p className="mt-2 text-sm text-[color:var(--color-gallery-fg)]/60">Productos disponibles</p>
      </div>

      {/* TODO: Grid + filters + cart sidebar */}
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>Tienda (en desarrollo)</p>
      </div>
    </div>
  );
}
