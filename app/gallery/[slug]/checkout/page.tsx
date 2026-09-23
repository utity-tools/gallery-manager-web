import type { Metadata } from "next";
import CheckoutProvider from "@/components/gallery-public/store/CheckoutProvider";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Checkout | ${slug} | Gallery Manager` };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;

  return <CheckoutProvider slug={slug} />;
}
