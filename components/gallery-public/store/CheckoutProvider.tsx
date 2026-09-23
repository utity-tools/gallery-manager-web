"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "@/components/gallery-public/store/Checkout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutProviderProps {
  slug: string;
}

export default function CheckoutProvider({ slug }: CheckoutProviderProps) {
  return (
    <Elements stripe={stripePromise}>
      <Checkout slug={slug} />
    </Elements>
  );
}
