import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-16 text-center sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent-500),transparent_55%)] opacity-40"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to bring your gallery online?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-gray-300">
            Join galleries already managing their collection with Gallery Manager.
          </p>
          <Link
            href="/signup"
            className="relative mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </section>
  );
}
