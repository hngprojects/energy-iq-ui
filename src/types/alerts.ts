import {
  AlertSeverity,
  AlertStatus,
  AlertIconType,
} from "@/lib/mocks/alerts-data";
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
