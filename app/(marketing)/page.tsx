import Hero from "@/components/marketing/Hero";
import Stats from "@/components/marketing/Stats";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import Testimonials from "@/components/marketing/Testimonials";
import UseCases from "@/components/marketing/UseCases";
import Pricing from "@/components/marketing/Pricing";
import Faq from "@/components/marketing/Faq";
import CtaBand from "@/components/marketing/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <UseCases />
      <Pricing />
      <Faq />
      <CtaBand />
    </>
  );
}
