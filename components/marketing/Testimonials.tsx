import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Gallery Manager transformed how we manage our inventory. What used to take hours now takes minutes, and our collectors love how easy it is to browse our work online.",
    author: "Sarah Chen",
    title: "Director, Chen Contemporary Gallery",
    location: "New York, USA",
  },
  {
    quote:
      "The exhibitions calendar feature is exactly what we needed. We can now coordinate across our three locations seamlessly, and every change updates instantly on all our websites.",
    author: "Miguel Rodríguez",
    title: "Owner, Rodríguez Arte Group",
    location: "Madrid, Spain",
  },
  {
    quote:
      "The onboarding team made our migration painless. We brought in 15 years of gallery history without losing a single piece of data. Now our whole team can collaborate without confusion.",
    author: "Emma Thompson",
    title: "Manager, Thompson Gallery London",
    location: "London, UK",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent-600">Trusted by gallery professionals</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            What gallery professionals say
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-gray-700">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="font-medium text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
                <p className="text-xs text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
