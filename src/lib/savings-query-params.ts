import type { CalculatorData } from "@/components/dashboard/cost-savings/calculator/calculator-context";
import type { SummaryPeriod } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import type { SavingsQueryParams } from "@/types/savings";

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function paramsFromSummaryPeriod(
  period: SummaryPeriod,
): SavingsQueryParams {
  return {
    period,
    date: toIsoDate(new Date()),
  };
}

export function paramsFromCalculatorData(
  data: CalculatorData,
): SavingsQueryParams | null {
  const calcPeriod = data.period;
  if (!calcPeriod) return null;

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (calcPeriod === "this-week") {
    return {
      period: "weekly",
      date: toIsoDate(now),
    };
  }

  if (calcPeriod === "this-month") {
    return {
      period: "monthly",
      date: toIsoDate(now),
    };
  }

  if (calcPeriod === "last-month") {
    const lastDay = new Date(y, m, 0);
    return {
      period: "monthly",
      date: toIsoDate(lastDay),
    };
  }

  if (calcPeriod === "custom") {
    if (!data.customStartDate || !data.customEndDate) return null;
    return {
      period: "monthly",
      date: data.customEndDate,
      startDate: data.customStartDate,
      endDate: data.customEndDate,
    };
  }

  return null;
}

export function formatSavingsChartLabel(
  isoLabel: string,
  period: SavingsQueryParams["period"],
): string {
  const date = new Date(isoLabel);
  if (Number.isNaN(date.getTime())) return isoLabel;

  if (period === "daily") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
