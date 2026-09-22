import Link from "next/link";
import Logo from "@/components/marketing/Logo";

interface MarketingHeaderProps {
  isAuthenticated: boolean;
}

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function MarketingHeader({ isAuthenticated }: MarketingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-700 sm:px-4"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:text-gray-900 sm:px-3"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-gray-700 sm:px-4"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
