import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { api } from "@/lib/api";

interface PaymentInput {
  slug: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    quantity: number;
    title: string;
    priceAtTime: number;
    variantes?: Record<string, string>;
  }>;
  totalPrice: number;
  shippingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (input: PaymentInput) => {
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: input.customerName,
          email: input.customerEmail,
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Create order with payment method
      const response = await api.post(
        `/api/public/galleries/${input.slug}/store/checkout`,
        {
          ...input,
          stripePaymentMethodId: paymentMethod.id,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Payment failed");
      }

      // Clear card after successful payment
      cardElement.clear();

      return response.data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment processing failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processPayment,
    isLoading,
    error,
    isReady: !!stripe && !!elements,
  };
}
