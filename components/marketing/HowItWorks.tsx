const steps = [
  {
    title: "Set up your gallery",
    description: "Create your account and configure your gallery settings in minutes.",
  },
  {
    title: "Add your inventory",
    description: "Upload artworks, create artist profiles, and organize your exhibitions.",
  },
  {
    title: "Go live",
    description: "Your professional gallery website is published and visible to collectors worldwide.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent-600">Getting started</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Launch in three simple steps
          </h2>
        </div>

        <ol className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-xl border border-gray-200 bg-white p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
