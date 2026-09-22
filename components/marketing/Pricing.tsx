import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For artists and small spaces getting started.",
    features: ["Up to 50 artworks", "5 artist profiles", "Public gallery site"],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Gallery",
    price: "$29",
    description: "For established galleries with an active programme.",
    features: ["Unlimited artworks", "Unlimited artists", "Exhibitions calendar", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-location galleries and institutions.",
    features: ["Everything in Gallery", "Multiple locations", "Custom domain", "Dedicated onboarding"],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent-600">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-600">Choose the plan that fits your gallery. Always flexible, always fair.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                plan.highlighted ? "border-accent-500 shadow-xl shadow-accent-500/10 ring-1 ring-accent-500" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-medium text-accent-700">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
              <p className="mt-6">
                <span className="text-4xl font-semibold tracking-tight text-gray-900">{plan.price}</span>
                {plan.price.startsWith("$") && <span className="text-sm text-gray-500"> /month</span>}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-accent-500 text-white hover:bg-accent-600"
                    : "border border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
