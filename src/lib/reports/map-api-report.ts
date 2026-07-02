import type { ApiReport } from "@/types/reports";
import type { Report } from "@/lib/mocks/reports-data";
import type { ReportIconType, ReportStatus } from "@/lib/mocks/reports-data";
import { formatDateRange, formatSingleDate } from "@/lib/utils";

export function mapApiReportToReport(apiRes: ApiReport): Report {
  let type = "Weekly";
  if (apiRes.type === "SOLAR") {
    type = "Solar";
  } else if (apiRes.type === "ALERT") {
    type = "Alert";
  } else if (apiRes.type === "COSTS_AND_SAVINGS") {
    type = "Costs & Savings";
  } else if (apiRes.period === "monthly") {
    type = "Monthly";
  } else if (apiRes.period === "weekly") {
    type = "Weekly";
  }

  let metricValue = "0 kWh";
  let metricLabel = "Solar";

  if (apiRes.type === "ALERT") {
    const alertsCount = Number(apiRes.keyMetrics?.totalAlerts ?? 0);
    metricValue = `${alertsCount} alerts`;
    metricLabel = "Logged";
  } else if (apiRes.type === "COSTS_AND_SAVINGS") {
    const costSaved = Number(apiRes.keyMetrics?.totalCostSavedNgn ?? 0);
    metricValue =
      costSaved > 0
        ? `₦${costSaved.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
        : "₦0";
    metricLabel = "Saved";
  } else {
    const energy = Number(apiRes.keyMetrics?.totalEnergyConsumedKwh ?? 0);
    if (energy > 0) {
      metricValue = `${energy.toLocaleString("en-NG", { maximumFractionDigits: 0 })} kWh`;
    }
  }

  let displayDateRange = "";
  if (apiRes.startDate && apiRes.endDate) {
    displayDateRange = formatDateRange(apiRes.startDate, apiRes.endDate);
  } else if (apiRes.referenceDate) {
    displayDateRange = formatSingleDate(apiRes.referenceDate);
  }

  let iconType: ReportIconType = "file";
  if (apiRes.type === "SOLAR") iconType = "solar";
  else if (apiRes.type === "ALERT") iconType = "alert";
  else if (apiRes.type === "COSTS_AND_SAVINGS") iconType = "dollar";
  else if (apiRes.period === "monthly") iconType = "calendar";

  const createdDate = new Date(apiRes.createdAt || Date.now());
  const formattedCreatedDate = Number.isNaN(createdDate.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(createdDate);

  return {
    id: apiRes.id,
    title: apiRes.name || `${type} Report`,
    subtitle: displayDateRange || apiRes.period || "weekly",
    type,
    status: (apiRes.status as ReportStatus) || "READY",
    date: formattedCreatedDate,
    iconType,
    keyMetrics: { value: metricValue, label: metricLabel },
    recipients: "Me",
  };
}
