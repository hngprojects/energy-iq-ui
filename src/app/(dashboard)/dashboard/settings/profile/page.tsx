import { ProfilePageClient } from "@/components/settings/profile/profile-page-client";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

export default function ProfileSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <DashboardBreadcrumb
          items={[
            { label: "Settings", href: "/dashboard/settings" },
            { label: "Account" },
          ]}
        />
      </div>
      <ProfilePageClient />
    </div>
  );
}
