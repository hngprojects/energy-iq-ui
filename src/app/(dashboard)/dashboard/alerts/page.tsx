"use client";
import { useAlerts, useAlertSummary } from "@/hooks/use-alerts-queries";
import { AlertStatCards } from "@/components/dashboard/alerts/alert-stat-cards";
import { AlertsTable } from "@/components/dashboard/alerts/alerts-table";
export default function AlertsPage() {
  const { data: summary, isLoading: isSummaryLoading } = useAlertSummary();
  const { data: alerts, isLoading: isAlertsLoading } = useAlerts();
  return (
    <div className="space-y-6">
      <AlertStatCards data={summary} isLoading={isSummaryLoading} />
      <AlertsTable initialData={alerts} isLoading={isAlertsLoading} />
    </div>
  );
}
