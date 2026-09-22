const tiles = [
  "from-amber-200 to-rose-300",
  "from-sky-200 to-indigo-300",
  "from-emerald-200 to-teal-300",
  "from-stone-200 to-stone-400",
  "from-orange-200 to-accent-300",
  "from-violet-200 to-fuchsia-300",
];

/** A stylised, image-free preview of the dashboard for the landing hero. */
export default function ProductMock() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-900/10">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
      </div>

      <div className="flex overflow-hidden rounded-xl border border-gray-100 bg-[color:var(--color-dashboard-bg)] text-left">
        <div className="hidden w-44 shrink-0 space-y-1 border-r border-gray-100 bg-white p-4 sm:block">
          <div className="mb-4 h-3 w-24 rounded bg-gray-200" />
          {["Dashboard", "Artworks", "Artists", "Exhibitions"].map((label, i) => (
            <div
              key={label}
              className={`rounded-md px-2 py-1.5 text-xs ${i === 1 ? "bg-accent-50 text-accent-700" : "text-gray-500"}`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex-1 p-5">
          <div className="grid grid-cols-3 gap-3">
            {["Artworks", "Artists", "Exhibitions"].map((label, i) => (
              <div key={label} className="rounded-lg border border-gray-100 bg-white p-3">
                <p className="text-[11px] text-gray-500">{label}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{[128, 24, 6][i]}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {tiles.map((gradient) => (
              <div key={gradient} className="rounded-lg border border-gray-100 bg-white p-2">
                <div className={`aspect-[4/3] rounded-md bg-gradient-to-br ${gradient}`} />
                <div className="mt-2 h-2 w-2/3 rounded bg-gray-200" />
                <div className="mt-1 h-2 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
