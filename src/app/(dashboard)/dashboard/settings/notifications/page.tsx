import type { Metadata } from "next";
import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

export const metadata: Metadata = {
  title: "Notifications | EnergyIQ",
  description: "Manage your notification preferences.",
};

export default function NotificationsSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <DashboardBreadcrumb
          items={[
            { label: "Settings", href: "/dashboard/settings" },
            { label: "Notifications" },
          ]}
        />
      </div>
      <ComingSoonDashboard
        feature="Notification Settings"
        description="Manage your alert preferences and notification history. Full notification centre coming soon."
      />
    </div>
  );
}
