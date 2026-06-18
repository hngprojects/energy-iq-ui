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
import type { ReportIconType } from "@/lib/mocks/reports-data";

export type ReportType = "weekly" | "monthly" | "solar" | "alerts" | "device" | "custom";

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
