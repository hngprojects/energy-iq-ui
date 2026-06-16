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

const mapApiAlert = (alert: ApiAlert): Alert => {
  const alertTime = alert.triggeredAt || alert.createdAt;

  const ALERT_TYPE_TO_ICON: Record<string, Alert["iconType"]> = {
    battery_percentage: "battery_low",
    power_high: "power_high",
    battery_full: "battery_full",
    check: "check",
    solar: "solar",
  };

  return {
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
    time: formatAlertTime(alertTime),
    sortTime: alertTime,
    iconType: ALERT_TYPE_TO_ICON[alert.type.toLowerCase()] ?? "clock",
    modalDetail: {
      metrics: [
        { label: "Severity", value: toTitleCase(alert.severity ?? "warning") },
        {
          label: "Status",
          value: toTitleCase(alert.resolutionStatus ?? "unresolved"),
        },
        {
          label: "Channel",
          value: toTitleCase(alert.deliveryChannel ?? "unknown"),
        },
      ],
      reason: alert.message,
    },
  };
};

const mapApiSummary = (
  summary: ApiAlertSummaryResponse,
): AlertSummaryResponse => ({
  activeAlerts: { count: summary.active, label: "Currently active" },
  critical: { count: summary.critical, label: "Need action now" },
  warning: { count: summary.warning, label: "Awaiting your review" },
  unresolved: { count: summary.unresolved, label: "Still open" },
});

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 100;

export const alertsService = {
  getAllAlerts: async (
    page: number = DEFAULT_PAGE_NUMBER,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<Alert[]> => {
    const alerts = await apiFetch<ApiAlert[]>(
      "/alerts",
      {
        params: { page_number: page, page_size: pageSize },
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
