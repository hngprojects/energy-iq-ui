import type { Metadata } from "next";
import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = {
  title: "Notifications | EnergyIQ",
  description: "Manage your notification preferences.",
};

export default function NotificationsSettingsPage() {
  return (
    <ComingSoonDashboard
      feature="Notification Settings"
      description="Manage your alert preferences and notification history. Full notification centre coming soon."
    />
  );
}
