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

export const alertsMock: Alert[] = [
  {
    id: "1",
    title: "Battery critically low",
    subtitle: "Charge level at 11%",
    severity: "critical",
    status: "unresolved",
    time: "Today, 6:10 am",
    iconType: "battery_low",
    modalDetail: {
      metrics: [
        { label: "Battery SOC", value: "11%" },
        { label: "Discharge rate", value: "1.4 KW" },
        { label: "Time to 0%", value: "~2h 30m" },
      ],
      reason:
        "Your battery reserve dropped below the 15% threshold at 5:42 am. Solar generated so far has not made up for the overnight draw. Immediate action recommended to avoid outage.",
    },
  },
  {
    id: "2",
    title: "Refrigeration unit drawing high power",
    subtitle: "4.3kWh consumed in 2 hours",
    severity: "warning",
    status: "unresolved",
    time: "Today, 3:00 am",
    iconType: "power_high",
  },
  {
    id: "3",
    title: "HVAC running outside scheduled hours",
    subtitle: "AC running 3 hours after scheduled time",
    severity: "warning",
    status: "resolved",
    time: "Yesterday, 5:00 am",
    iconType: "clock",
  },
  {
    id: "4",
    title: "Battery fully charged",
    subtitle: "Your battery has reached 100%",
    severity: "success",
    status: "no_action_needed",
    time: "6 May, 5:00 pm",
    iconType: "battery_full",
  },
  {
    id: "5",
    title: "Automation rule updated successfully",
    subtitle: "Your HVAC eco rule adjusted by AI Agent",
    severity: "success",
    status: "no_action_needed",
    time: "5 May, 4:20 pm",
    iconType: "check",
  },
  {
    id: "6",
    title: "Solar generation 48% below forecast",
    subtitle: "Possible panel shading or inverter underperformance",
    severity: "warning",
    status: "resolved",
    time: "4 May, 5:30 pm",
    iconType: "solar",
  },
];

export const alertStatsMock = {
  activeAlerts: { count: 14, label: "Last 7 days" },
  critical: { count: 1, label: "Need action now" },
  warning: { count: 3, label: "Awaiting your review" },
  unresolved: { count: 5, label: "Still open" },
};

export const FILTER_OPTIONS: { value: AlertFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "resolved", label: "Resolved" },
  { value: "unresolved", label: "Unresolved" },
];
