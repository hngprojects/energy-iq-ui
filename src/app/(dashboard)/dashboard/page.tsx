import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Monitor your solar energy generation, battery status, and power savings in real time.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}

