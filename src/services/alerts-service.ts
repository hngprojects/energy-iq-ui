import { apiFetch } from "@/lib/api/client";
import {
  Alert,
  AlertSummaryResponse,
  ApiAlert,
  ApiAlertSummaryResponse,
} from "@/types/alerts";
import { alertsMock, alertStatsMock } from "@/lib/mocks/alerts-data";
import { ApiError } from "@/lib/api/error";
import axios from "axios";

// TODO: Remove this fallback once the backend implements these endpoints.
// Until then, any 404 from the API gracefully falls back to mock data so
// the alerts page remains functional during development.
const isMissingEndpoint = (err: unknown) => {
  if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
    return true;
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 404 || status === 400) return true;
  }

  return false;
};

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
  severity:
    alert.severity.toLowerCase() === "critical" ? "critical" : "warning",
  status:
    alert.resolutionStatus.toLowerCase() === "resolved"
      ? "resolved"
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
    try {
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
    } catch (err) {
      if (isMissingEndpoint(err)) return alertsMock as Alert[];
      throw err;
    }
  },

  getAlertSummary: async (): Promise<AlertSummaryResponse> => {
    try {
      const summary = await apiFetch<ApiAlertSummaryResponse>(
        "/alerts/summary",
        {},
        true,
      );

      return mapApiSummary(summary);
    } catch (err) {
      if (isMissingEndpoint(err)) return alertStatsMock as AlertSummaryResponse;
      throw err;
    }
  },

  getAlertById: async (id: string): Promise<Alert> => {
    try {
      const alert = await apiFetch<ApiAlert>(`/alerts/${id}`, {}, true);

      return mapApiAlert(alert);
    } catch (err) {
      if (isMissingEndpoint(err)) {
        const found = alertsMock.find((a) => a.id === id);
        if (found) return found as Alert;
      }

      throw err;
    }
  },

  resolveAlert: async (id: string): Promise<void> => {
    try {
      return await apiFetch<void>(
        `/alerts/${id}/resolve`,
        { method: "PATCH" },
        true,
      );
    } catch (err) {
      // Silently swallow 404 resolves because mock data has no persist layer.
      if (isMissingEndpoint(err)) return;
      throw err;
    }
  },
};
