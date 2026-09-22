const stats = [
  {
    value: "6,000+",
    label: "Galleries & artists worldwide",
  },
  {
    value: "2.5M",
    label: "Artworks under management",
  },
  {
    value: "$500M",
    label: "Annual sales processed",
  },
];

export default function Stats() {
  return (
    <section className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-semibold tracking-tight text-accent-600 sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
