import Link from "next/link";
import ProductMock from "@/components/marketing/ProductMock";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--color-accent-100),transparent_65%)]"
      />

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 md:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-1 text-xs font-medium text-accent-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          Trusted by galleries worldwide
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
          All-in-one platform for gallery professionals
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          Manage, market and sell art with confidence. Inventory, exhibitions, public presence and team collaboration in one integrated system.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-lg bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-600"
          >
            Try for free
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Book a call
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">No credit card required</p>

        <div className="mt-16">
          <ProductMock />
        </div>
      </div>
    </section>
  );
}
