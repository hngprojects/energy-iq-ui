import type React from "react";
import {
  FileText,
  Calendar,
  Sun,
  AlertTriangle,
  Zap,
  Settings,
  Clock,
  BatteryFull,
  CheckCircle,
  Unplug,
  Microchip,
} from "lucide-react";

export type ReportType = "weekly" | "monthly" | "solar" | "alerts" | "device" | "custom";

export type ReportIconType =
  | "battery_low"
  | "power_high"
  | "clock"
  | "battery_full"
  | "check"
  | "solar"
  | "file"
  | "alert"
  | "device"
  | "calendar"
  | "chip";

export type ReportFilterType =
  | "all"
  | "Solar"
  | "Weekly"
  | "Monthly"
  | "Alert"
  | "Device";

export interface ReportTypeOption {
  id: ReportType;
  label: string;
  icon: React.ElementType;
}

export const REPORT_TYPES: ReportTypeOption[] = [
  { id: "weekly", label: "Weekly", icon: FileText },
  { id: "monthly", label: "Monthly", icon: Calendar },
  { id: "solar", label: "Solar", icon: Sun },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "device", label: "Device", icon: Zap },
  { id: "custom", label: "Custom", icon: Settings },
];

export const REPORT_ICON_MAP: Record<ReportIconType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  battery_low: AlertTriangle,
  power_high: Unplug,
  clock: Clock,
  battery_full: BatteryFull,
  check: CheckCircle,
  solar: Sun,
  file: FileText,
  alert: AlertTriangle,
  device: Zap,
  calendar: Calendar,
  chip: Microchip,
};

export const REPORT_FREQUENCY_LABELS: Record<ReportType, string> = {
  weekly: "Mondays",
  monthly: "Monthly",
  solar: "Daily (Solar)",
  alerts: "On alert",
  device: "Device events",
  custom: "Custom",
};

export const FILTER_OPTIONS: { value: ReportFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Solar", label: "Solar" },
  { value: "Alert", label: "Alerts" },
  { value: "Device", label: "Device" },
];

export const REPORT_BACKEND_TYPE_MAP: Record<ReportType, string> = {
  weekly: "GENERAL",
  monthly: "GENERAL",
  solar: "SOLAR",
  alerts: "ALERT",
  device: "COSTS_AND_SAVINGS",
  custom: "GENERAL",
};

export const REPORT_PERIOD_MAP: Record<ReportType, string> = {
  weekly: "weekly",
  monthly: "monthly",
  solar: "weekly",
  alerts: "weekly",
  device: "weekly",
  custom: "weekly",
};

export const REPORT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: {
    bg: "var(--color-warning-bg)",
    text: "var(--color-warning)",
  },
  CANCELLED: {
    bg: "var(--color-slate-20)",
    text: "var(--color-slate-70)",
  },
  READY: {
    bg: "var(--color-success-bg)",
    text: "var(--color-success-alt)",
  },
  PROCESSING: {
    bg: "var(--color-slate-20)",
    text: "var(--color-slate-70)",
  },
  FAILED: {
    bg: "var(--color-danger-bg)",
    text: "var(--color-danger)",
  },
};

export const REPORT_STATUS_NEUTRAL: { bg: string; text: string } = {
  bg: "var(--color-slate-20)",
  text: "var(--color-slate-70)",
};

export function getStatusColors(status: string): { bg: string; text: string } {
  return REPORT_STATUS_COLORS[status?.toUpperCase()] ?? REPORT_STATUS_NEUTRAL;
}

export const REPORT_STAT_CARD_ICON_COLORS: Record<string, string> = {
  periodic: "text-(--color-dark-text)",
  solar: "text-(--color-amber-40)",
  alert: "text-destructive",
  device: "text-(--color-battery-full)",
};
