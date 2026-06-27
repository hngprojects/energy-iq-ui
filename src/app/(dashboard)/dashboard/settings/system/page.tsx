import { SystemDeviceClient } from "@/components/settings/system/system-device-client";

import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

export default function SystemDevicePage() {
  return (
    <div>
      <div className="mb-6">
        <DashboardBreadcrumb
          items={[
            { label: "Settings", href: "/dashboard/settings" },
            { label: "System & Device" },
          ]}
        />
      </div>
      <SystemDeviceClient />
    </div>
  );
}
