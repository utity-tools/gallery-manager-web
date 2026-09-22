import Link from "next/link";

interface AboutContactNavProps {
  slug: string;
  active: "about" | "contact";
}

export default function AboutContactNav({ slug, active }: AboutContactNavProps) {
  const links = [
    { key: "about", label: "ABOUT", href: `/gallery/${slug}/about` },
    { key: "contact", label: "CONTACT", href: `/gallery/${slug}/contact` },
  ] as const;

  return (
    <nav className="mt-6 flex flex-col gap-2">
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className={`w-fit text-xs tracking-[0.15em] text-[color:var(--color-gallery-fg)] ${
            active === link.key ? "underline underline-offset-4" : "opacity-60 hover:opacity-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
