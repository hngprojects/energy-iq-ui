"use client";

import { useAlerts, useAlertSummary } from "@/hooks/use-alerts-queries";
import { AlertStatCards } from "@/components/dashboard/alerts/alert-stat-cards";
import { AlertsTable } from "@/components/dashboard/alerts/alerts-table";
import type { AlertSummaryResponse } from "@/types/alerts";

export default function AlertsPage() {
  const { data: summary, isLoading: isSummaryLoading } = useAlertSummary();
  const { data: alerts, isLoading: isAlertsLoading } = useAlerts();

  const derivedSummary: AlertSummaryResponse | undefined = summary && {
    ...summary,
    critical: {
      ...summary.critical,
      count:
        alerts?.filter(
          (a) => a.severity === "critical" && a.status === "unresolved",
        ).length ?? summary.critical.count,
    },
    warning: {
      ...summary.warning,
      count:
        alerts?.filter(
          (a) => a.severity === "warning" && a.status === "unresolved",
        ).length ?? summary.warning.count,
    },
  };

  return (
    <div className="space-y-6">
      <AlertStatCards data={derivedSummary} isLoading={isSummaryLoading} />
      <AlertsTable initialData={alerts} isLoading={isAlertsLoading} />
    </div>
  );
}
