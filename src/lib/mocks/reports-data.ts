export type ReportSeverity = "critical" | "warning" | "success";
export type ReportStatus = "Ready";
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

export interface ReportMetric {
  label: string;
  value: string;
}

export interface ReportModalDetail {
  metrics: ReportMetric[];
  reason: string;
}

export interface Report {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  status: ReportStatus;
  date: string;
  iconType: ReportIconType;
  keyMetrics: {
    value: string;
    label: string;
  };
  recipients: string;
  modalDetail?: ReportModalDetail;
}

export const reportsMock: Report[] = [
  {
    id: "1",
    title: "Solar Performance - May Wk 1",
    subtitle: "1 - 5 May",
    type: "Solar",
    status: "Ready",
    date: "5 May 2026",
    iconType: "solar",
    keyMetrics: { value: "189 kWh", label: "Solar" },
    recipients: "Amaka",
  },
  {
    id: "2",
    title: "Week 3 Energy Report",
    subtitle: "27 April - 3 May",
    type: "Weekly",
    status: "Ready",
    date: "4 May 2026",
    iconType: "file",
    keyMetrics: { value: "312 kWh", label: "Solar" },
    recipients: "Amaka",
  },
  {
    id: "3",
    title: "April Monthly Summary",
    subtitle: "April 2026",
    type: "Monthly",
    status: "Ready",
    date: "1 May 2026",
    iconType: "calendar",
    keyMetrics: { value: "703 kWh", label: "Solar" },
    recipients: "Amaka",
  },
  {
    id: "4",
    title: "Alert Digest - Week 2",
    subtitle: "27 April - 3 May",
    type: "Alert",
    status: "Ready",
    date: "30 April 2026",
    iconType: "alert",
    keyMetrics: { value: "14 alerts", label: "Logged" },
    recipients: "Amaka",
  },
  {
    id: "5",
    title: "Week 2 Energy Report",
    subtitle: "20 - 26 April",
    type: "Weekly",
    status: "Ready",
    date: "27 April 2026",
    iconType: "file",
    keyMetrics: { value: "264 kWh", label: "Solar" },
    recipients: "Amaka",
  },
  {
    id: "6",
    title: "Device Consumption Breakdown",
    subtitle: "13 - 20 April",
    type: "Device",
    status: "Ready",
    date: "20 April 2026",
    iconType: "chip",
    keyMetrics: { value: "5 alerts", label: "Logged" },
    recipients: "Amaka",
  },
  {
    id: "7",
    title: "Week 1 Energy Report",
    subtitle: "13 - 19 April",
    type: "Weekly",
    status: "Ready",
    date: "20 April 2026",
    iconType: "file",
    keyMetrics: { value: "261 kWh", label: "Solar" },
    recipients: "Amaka",
  },
];

export const FILTER_OPTIONS: { value: ReportFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Solar", label: "Solar" },
  { value: "Alert", label: "Alerts" },
  { value: "Device", label: "Device" },
];

export const reportStatsMock = {
  solarGenerated: { label: "Solar generated", value: "1,248 kWh", sub: "14% vs April" },
  reportsSent: { label: "Reports Sent", value: "12", sub: "To 5 recipients this month" },
  batteryEfficiency: { label: "Battery Efficiency", value: "91%", sub: "3% vs April" },
  reportsResolved: { label: "Reports Resolved", value: "11 / 14", sub: "79% resolution rate" },
};

