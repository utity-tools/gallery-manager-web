"use client";

interface CartProps {
  slug: string;
}

export default function Cart({ slug: _slug }: CartProps) {
  return (
    <div className="fixed right-4 bottom-4 w-80 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      {/* TODO: Cart items + checkout button */}
      <h3 className="font-semibold text-gray-900">Carrito</h3>
      <p className="mt-2 text-sm text-gray-500">Carrito (en desarrollo)</p>
    </div>
  );
}
