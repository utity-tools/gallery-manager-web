import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
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

interface CheckoutResponse {
  success: boolean;
  data: {
    orderId: string;
    clientSecret: string;
    totalPrice: number;
  };
  error?: {
    message: string;
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

      // Step 1: Create order and get clientSecret from backend
      const checkoutResponse = await api.post<CheckoutResponse>(
        `/public/galleries/${input.slug}/store/checkout`,
        {
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          items: input.items,
          totalPrice: input.totalPrice,
          shippingAddress: input.shippingAddress,
        }
      );

      if (!checkoutResponse.data.success) {
        throw new Error(checkoutResponse.data.error?.message || "Failed to create order");
      }

      const { clientSecret, orderId } = checkoutResponse.data.data;

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: input.customerName,
            email: input.customerEmail,
          },
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message || "Payment confirmation failed");
      }

      // Step 3: Verify payment succeeded
      if (paymentIntent.status !== "succeeded") {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }

      // Clear card after successful payment
      cardElement.clear();

      return {
        orderId,
        success: true,
      };
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
