import Logo from "@/components/marketing/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-white font-sans text-gray-900 lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Gallery Manager</p>
      </div>

      <aside className="relative hidden overflow-hidden bg-gray-900 lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent-500),transparent_60%)] opacity-50"
        />
        <div aria-hidden="true" className="absolute inset-x-12 top-16 grid grid-cols-3 gap-3 opacity-80">
          {[
            "from-amber-200 to-rose-300",
            "from-sky-200 to-indigo-300",
            "from-emerald-200 to-teal-300",
            "from-orange-200 to-accent-300",
            "from-violet-200 to-fuchsia-300",
            "from-stone-200 to-stone-400",
          ].map((gradient) => (
            <div key={gradient} className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${gradient}`} />
          ))}
        </div>

        <figure className="relative">
          <blockquote className="text-xl leading-relaxed font-medium text-white">
            &ldquo;We moved our whole programme online in an afternoon. Our collectors now browse new works
            before the opening night.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-gray-300">Jane Doe — Director, Example Gallery</figcaption>
        </figure>
      </aside>
    </div>
  );
}
