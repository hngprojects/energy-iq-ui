import { apiFetch } from "@/lib/api/client";
import {
  Alert,
  AlertSummaryResponse,
  ApiAlert,
  ApiAlertSummaryResponse,
} from "@/types/alerts";

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatAlertTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const mapApiAlert = (alert: ApiAlert): Alert => ({
  id: alert.id,
  title: toTitleCase(alert.type),
  subtitle: alert.message,
  severity: alert.severity
    ? alert.severity.toLowerCase() === "critical"
      ? "critical"
      : (alert.severity.toLowerCase() as Alert["severity"])
    : "warning",
  status: alert.resolutionStatus
    ? alert.resolutionStatus.toLowerCase() === "resolved"
      ? "resolved"
      : (alert.resolutionStatus.toLowerCase() as Alert["status"])
    : "unresolved",
  time: formatAlertTime(alert.triggeredAt || alert.createdAt),
  iconType: alert.type === "BATTERY_PERCENTAGE" ? "battery_low" : "clock",
  modalDetail: {
    metrics: [
      { label: "Severity", value: toTitleCase(alert.severity) },
      { label: "Status", value: toTitleCase(alert.resolutionStatus) },
      { label: "Channel", value: toTitleCase(alert.deliveryChannel) },
    ],
    reason: alert.message,
  },
});

const mapApiSummary = (
  summary: ApiAlertSummaryResponse,
): AlertSummaryResponse => ({
  activeAlerts: { count: summary.active, label: "Currently active" },
  critical: { count: summary.critical, label: "Need action now" },
  warning: { count: summary.warning, label: "Awaiting your review" },
  unresolved: { count: summary.unresolved, label: "Still open" },
});

export const alertsService = {
  getAllAlerts: async (): Promise<Alert[]> => {
    const alerts = await apiFetch<ApiAlert[]>(
      "/alerts",
      {
        params: {
          alert_type: "BATTERY_PERCENTAGE",
        },
      },
      true,
    );

    return alerts.map(mapApiAlert);
  },

  getAlertSummary: async (): Promise<AlertSummaryResponse> => {
    const summary = await apiFetch<ApiAlertSummaryResponse>(
      "/alerts/summary",
      {},
      true,
    );

    return mapApiSummary(summary);
  },

  getAlertById: async (id: string): Promise<Alert> => {
    const alert = await apiFetch<ApiAlert>(`/alerts/${id}`, {}, true);

    return mapApiAlert(alert);
  },

  resolveAlert: async (id: string): Promise<void> => {
    return await apiFetch<void>(
      `/alerts/${id}/resolve`,
      { method: "PATCH" },
      true,
    );
  },
};
