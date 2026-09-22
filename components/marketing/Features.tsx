import { CalendarDays, Globe, ImageIcon, LayoutDashboard, ShieldCheck, Users } from "lucide-react";

const features = [
  {
    icon: ImageIcon,
    title: "Artwork management",
    description: "Complete inventory control with images, pricing, provenance and unlimited storage.",
  },
  {
    icon: Users,
    title: "Artist profiles",
    description: "Biographies, CV, portfolio, exhibition history and media kit for every artist.",
  },
  {
    icon: CalendarDays,
    title: "Exhibition planning",
    description: "Plan, curate and manage exhibitions with dates, venues, artist selection and artworks.",
  },
  {
    icon: Globe,
    title: "Public website",
    description: "Professional gallery website that updates automatically with your latest inventory.",
  },
  {
    icon: LayoutDashboard,
    title: "Central dashboard",
    description: "Single workspace for your entire team. Manage all aspects of your gallery operations.",
  },
  {
    icon: ShieldCheck,
    title: "Built for galleries",
    description: "Controls over what's public, private or draft. Collaboration tools for your team.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-gray-100 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent-600">Core features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Integrated tools for modern galleries
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to manage inventory, artists, exhibitions and your online presence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
