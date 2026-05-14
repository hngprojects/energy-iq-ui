import AboutPage from "@/components/external/about-us";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | EnergyIQ",
  description: "Learn how the EnergyIQ platform works.",
};

export default function HowItWorksPage() {
  return (
    <div className="flex w-full flex-col">
      <AboutPage />
    </div>
  );
}
