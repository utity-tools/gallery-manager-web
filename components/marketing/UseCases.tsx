import { Users, Building2, Palette } from "lucide-react";

const useCases = [
  {
    icon: Building2,
    title: "Established Galleries",
    description: "Multi-location galleries managing complex inventories, artist relationships and exhibition schedules across teams.",
    features: ["Multiple locations", "Team collaboration", "Advanced reporting", "API access"],
  },
  {
    icon: Palette,
    title: "Independent Artists",
    description: "Solo artists and artist collectives showcasing their work, managing sales and building their collector base.",
    features: ["Artist portfolio", "Commission tracking", "Collector database", "Social sharing"],
  },
  {
    icon: Users,
    title: "Art Fairs & Events",
    description: "Event organizers coordinating multiple galleries and artists, managing booth inventory and real-time updates.",
    features: ["Multi-gallery support", "Real-time sync", "Public directory", "Check-in tools"],
  },
];

export default function UseCases() {
  return (
    <section id="use-cases" className="border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent-600">Tailored solutions</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Built for every gallery model
          </h2>
          <p className="mt-4 text-gray-600">
            Whether you&apos;re a solo artist, gallery group or art fair, Gallery Manager adapts to your needs.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {useCases.map(({ icon: Icon, title, description, features }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {features.map((feature) => (
                  <li key={feature} className="text-xs text-gray-700">
                    <span className="font-medium">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
