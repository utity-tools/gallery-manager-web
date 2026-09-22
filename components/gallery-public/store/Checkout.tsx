"use client";

interface CheckoutProps {
  slug: string;
}

export default function Checkout({ slug: _slug }: CheckoutProps) {
  return (
    <div data-testid="checkout-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">CHECKOUT</h1>

      {/* TODO: Cart review + address form + Stripe CardElement */}
      <div className="mt-8 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        <p>Checkout (en desarrollo)</p>
      </div>
    </div>
  );
}
