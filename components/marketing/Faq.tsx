import { ChevronDown } from "lucide-react";

const questions = [
  {
    q: "Is Gallery Manager suitable for all gallery types?",
    a: "Yes. Gallery Manager works for independent galleries, artist collectives, art fairs, and multi-location gallery groups. We provide customized features for different gallery models.",
  },
  {
    q: "What if I already have artwork inventory somewhere else?",
    a: "Our onboarding team handles data migration from most systems. You won't lose any information in the transition, and we provide step-by-step support.",
  },
  {
    q: "How do I keep my inventory private until I'm ready?",
    a: "All artworks are private by default. You control exactly what appears on your public website. Draft, review and publish on your timeline.",
  },
  {
    q: "Do you offer support and training?",
    a: "All plans include email support. Gallery plan and above get priority support. We also provide onboarding calls, video tutorials and documentation.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-gray-100 bg-gray-50 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-accent-600">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {questions.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
                {q}
                <ChevronDown size={18} className="shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
