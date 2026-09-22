import Link from "next/link";
import Image from "next/image";
import type { ApiGallery } from "@/lib/types/models";

interface LogoProps {
  gallery?: ApiGallery;
  href?: string;
}

export default function Logo({ gallery, href = "/" }: LogoProps) {
  const logoUrl = gallery?.logoUrl;
  const title = gallery?.title || "Gallery Manager";

  if (logoUrl) {
    return (
      <Link href={href} className="flex items-center gap-2 whitespace-nowrap">
        <div className="relative h-7 w-auto flex-shrink-0">
          <Image
            src={logoUrl}
            alt={title}
            height={28}
            width={140}
            className="h-7 w-auto"
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-2 text-base font-semibold tracking-tight whitespace-nowrap text-gray-900">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-500 text-xs font-bold text-white">
        G
      </span>
      {title}
    </Link>
  );
}
