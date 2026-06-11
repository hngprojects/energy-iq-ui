import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

export default function TeamAccessPage() {
  return (
    <div>
      <div className="mb-6">
        <DashboardBreadcrumb
          items={[
            { label: "Settings", href: "/dashboard/settings" },
            { label: "Team & Access" },
          ]}
        />
      </div>
      <ComingSoonDashboard
        feature="Team & Access"
        description="Control organisational hierarchies by assigning specific user roles, permissions, and administrative access levels."
      />
    </div>
  );
}
