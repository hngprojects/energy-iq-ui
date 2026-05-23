import type { Metadata } from "next";
import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = {
  title: "Reports | EnergyIQ",
  description: "Detailed energy reports and analytics for your solar system.",
};

export default function ReportsPage() {
  return (
    <ComingSoonDashboard
      feature="Reports"
      description="Detailed energy reports, usage history, and exportable analytics are on the way."
    />
  );
}
