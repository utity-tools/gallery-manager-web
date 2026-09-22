"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CardElement } from "@stripe/react-stripe-js";
import { useCart } from "@/hooks/useCart";
import { useStripePayment } from "@/hooks/useStripePayment";

const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutProps {
  slug: string;
}

export default function Checkout({ slug }: CheckoutProps) {
  const { items, total, clear } = useCart();
  const { processPayment, isLoading: isPaymentLoading, error: paymentError, isReady } = useStripePayment();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!isReady) {
      setError("Stripe is not loaded. Please refresh the page.");
      return;
    }

    setError(null);

    const result = await processPayment({
      slug,
      customerName: values.name,
      customerEmail: values.email,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        title: item.title,
        priceAtTime: item.priceAtTime,
        variantes: item.variantes,
      })),
      totalPrice: total,
      shippingAddress: {
        line1: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      },
    });

    if (result && result.success) {
      setSuccess(true);
      clear();
      setTimeout(() => {
        window.location.href = `/gallery/${slug}/store`;
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-success-50 p-8 text-center text-success-700">
          <h1 className="font-serif text-3xl font-bold text-success-900">¡Pedido Confirmado!</h1>
          <p className="mt-2">Te hemos enviado un email de confirmación.</p>
          <p className="mt-4 text-sm text-success-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">CHECKOUT</h1>
        <div className="mt-8 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <p>Tu carrito está vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="checkout-page" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-2xl tracking-wide text-[color:var(--color-gallery-fg)]">CHECKOUT</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Orden */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Resumen de Orden</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${JSON.stringify(item.variantes)}`} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-900">{item.title}</span>
                    <span className="font-medium">€{(item.priceAtTime * item.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-accent-500">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          {error && (
            <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
              {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
              {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                {...register("phone")}
                type="tel"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
              {errors.phone && <p className="mt-1 text-xs text-danger-600">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Dirección de Envío</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                {...register("address")}
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
              {errors.address && <p className="mt-1 text-xs text-danger-600">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input
                  {...register("city")}
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                />
                {errors.city && <p className="mt-1 text-xs text-danger-600">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                <input
                  {...register("postalCode")}
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-danger-600">{errors.postalCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <input
                {...register("country")}
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
              />
              {errors.country && <p className="mt-1 text-xs text-danger-600">{errors.country.message}</p>}
            </div>
          </div>

          {/* Stripe Card Input */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>

            {(error || paymentError) && (
              <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
                <p className="text-sm">{error || paymentError}</p>
              </div>
            )}

            <div className="rounded-md border border-gray-300 p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPaymentLoading || !isReady}
            className="w-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaymentLoading ? "Procesando Pago..." : "Completar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
