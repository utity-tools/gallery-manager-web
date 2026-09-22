"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginFormValues } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (!result?.ok || result?.error) {
      setFormError(result?.error || "Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
        />
        {errors.email && <p className="mt-1.5 text-sm text-danger-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
        />
        {errors.password && <p className="mt-1.5 text-sm text-danger-600">{errors.password.message}</p>}
      </div>

      {formError && (
        <p role="alert" className="rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
