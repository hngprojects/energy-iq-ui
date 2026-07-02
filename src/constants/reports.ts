import type React from "react";
import {
  FileText,
  Calendar,
  Sun,
  AlertTriangle,
  Settings,
  Clock,
  BatteryFull,
  CheckCircle,
  Unplug,
  Microchip,
  DollarSign,
} from "lucide-react";

export type ReportPeriodId = "weekly" | "monthly" | "custom";

export type ReportTypeId = "general" | "alerts" | "costsAndSavings" | "solar";

export type ReportIconType =
  | "battery_low"
  | "power_high"
  | "clock"
  | "battery_full"
  | "check"
  | "solar"
  | "file"
  | "alert"
  | "dollar"
  | "calendar"
  | "chip";

export type ReportFilterType =
  | "all"
  | "Solar"
  | "Weekly"
  | "Monthly"
  | "Alert"
  | "Costs & Savings";

export interface ReportPeriodOption {
  id: ReportPeriodId;
  label: string;
  icon: React.ElementType;
}

export interface ReportTypeOption {
  id: ReportTypeId;
  label: string;
  icon: React.ElementType;
  backendValue: "GENERAL" | "SOLAR" | "ALERT" | "COSTS_AND_SAVINGS";
}

export const PERIOD_OPTIONS: ReportPeriodOption[] = [
  { id: "weekly", label: "Weekly", icon: FileText },
  { id: "monthly", label: "Monthly", icon: Calendar },
  { id: "custom", label: "Custom", icon: Settings },
];

export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  { id: "general", label: "General", icon: FileText, backendValue: "GENERAL" },
  { id: "alerts", label: "Alerts", icon: AlertTriangle, backendValue: "ALERT" },
  {
    id: "costsAndSavings",
    label: "Costs & Savings",
    icon: DollarSign,
    backendValue: "COSTS_AND_SAVINGS",
  },
  { id: "solar", label: "Solar", icon: Sun, backendValue: "SOLAR" },
];

export const REPORT_ICON_MAP: Record<
  ReportIconType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  battery_low: AlertTriangle,
  power_high: Unplug,
  clock: Clock,
  battery_full: BatteryFull,
  check: CheckCircle,
  solar: Sun,
  file: FileText,
  alert: AlertTriangle,
  dollar: DollarSign,
  calendar: Calendar,
  chip: Microchip,
};

export const REPORT_FREQUENCY_LABELS: Record<
  Extract<ReportPeriodId, "weekly" | "monthly">,
  string
> = {
  weekly: "Mondays",
  monthly: "Monthly",
};

export const FILTER_OPTIONS: { value: ReportFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Solar", label: "Solar" },
  { value: "Alert", label: "Alerts" },
  { value: "Costs & Savings", label: "Costs & Savings" },
];

export const REPORT_STATUS_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
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
  costsAndSavings: "text-(--color-battery-full)",
};
