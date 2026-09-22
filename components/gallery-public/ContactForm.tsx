"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required").max(1000, "Message must be 1000 characters or fewer"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  slug: string;
}

export default function ContactForm({ slug }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await api.post(`/public/galleries/${slug}/contact`, values);

      if (response.data.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(response.data.error?.message || "Failed to send message");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-success-50 p-4 text-success-700">
        <p className="font-semibold">Thank you!</p>
        <p className="mt-1 text-sm">Your message has been sent. We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-danger-50 p-4 text-danger-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[color:var(--color-gallery-fg)]">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          {...register("name")}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
        {errors.name && <p className="mt-1 text-xs text-danger-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--color-gallery-fg)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
        {errors.email && <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[color:var(--color-gallery-fg)]">
          Message
        </label>
        <textarea
          id="message"
          placeholder="Your message..."
          rows={6}
          {...register("message")}
          className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
        {errors.message && <p className="mt-1 text-xs text-danger-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-block bg-[color:var(--color-gallery-accent)] px-8 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
      </button>
    </form>
  );
}
