import { WorksWith } from "@/components/external/brands";
import { Faq } from "@/components/external/faq";
import { Hero } from "@/components/external/hero";
import { PricingSection } from "@/components/external/pricing";
import { RequestDemo } from "@/components/external/request-demo";
import { Services } from "@/components/external/services";
import { TestimonialsSection } from "@/components/external/testimonial";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <Hero />
      <section id="features" className="w-full px-6">
        <WorksWith />
        <Services />
      </section>
      <RequestDemo />
      <TestimonialsSection />
      <section id="pricing" className="w-full">
        <PricingSection />
      </section>
      <section id="faq" className="w-full">
        <Faq />
      </section>
    </div>
  );
}
