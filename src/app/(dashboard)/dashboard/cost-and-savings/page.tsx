import type { Metadata } from "next";
import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = {
  title: "Cost & Savings | EnergyIQ",
  description: "Track your energy cost savings and financial impact over time.",
};

export default function CostAndSavingsPage() {
  return (
    <ComingSoonDashboard
      feature="Cost & Savings"
      description="A full breakdown of what you've saved on electricity and diesel costs is coming soon."
    />
  );
}
