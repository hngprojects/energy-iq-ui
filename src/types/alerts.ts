export type AlertSeverity = "critical" | "warning" | "success";
export type AlertStatus = "unresolved" | "resolved" | "no_action_needed";

export type AlertIconType =
  | "battery_low"
  | "power_high"
  | "clock"
  | "battery_full"
  | "check"
  | "solar";

export type AlertFilterType =
  | "all"
  | "success"
  | "warning"
  | "critical"
  | "resolved"
  | "unresolved";

export interface AlertMetric {
  label: string;
  value: string;
}

export interface AlertModalDetail {
  metrics: AlertMetric[];
  reason: string;
}

export interface Alert {
  id: string;
  title: string;
  subtitle: string;
  severity: AlertSeverity;
  status: AlertStatus;
  time: string;
  iconType: AlertIconType;
  modalDetail?: AlertModalDetail;
}

export interface StatItem {
  count: number;
  label: string;
}

export interface AlertSummaryResponse {
  activeAlerts: StatItem;
  critical: StatItem;
  warning: StatItem;
  unresolved: StatItem;
}

export interface ApiAlert {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  type: string;
  platform: string;
  severity: string;
  message: string;
  resolutionStatus: string;
  triggeredAt: string;
  isActive: boolean;
  deliveryProcessingStatus: string;
  deliverable: boolean;
  deliveryStatus: string;
  deliveryChannel: string;
  quietHoursDeferredUntil: string | null;
  cooldownExpiresAt: string | null;
  metadata: unknown;
}

export interface ApiAlertSummaryResponse {
  active: number;
  critical: number;
  unresolved: number;
  warning: number;
}
