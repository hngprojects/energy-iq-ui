import type {
  CalculatorData,
  CalculationPeriod,
} from "@/components/dashboard/cost-savings/calculator/calculator-context";
import type { SummaryPeriod } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import type { SavingsQueryParams } from "@/types/savings";

const CALCULATOR_PERIOD_LABELS: Record<CalculationPeriod, string> = {
  "this-week": "This Week",
  "this-month": "This Month",
  "last-month": "Last Month",
  custom: "Custom Range",
};

function parseDateString(dateString: string): Date {
  const hasTime = /[Tt]/.test(dateString) || dateString.endsWith("Z");
  return new Date(hasTime ? dateString : `${dateString}T00:00:00`);
}

function fmtDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getCalculatorPeriodLabel(period: CalculationPeriod): string {
  return CALCULATOR_PERIOD_LABELS[period];
}

export function getCalculatorPeriodDateRange(
  period: CalculationPeriod,
  customStartDate?: string,
  customEndDate?: string,
): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === "custom" && customStartDate && customEndDate) {
    return `${fmtDisplayDate(parseDateString(customStartDate))} - ${fmtDisplayDate(parseDateString(customEndDate))}`;
  }

  if (period === "this-week") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${fmtDisplayDate(weekStart)} - ${fmtDisplayDate(weekEnd)}`;
  }

  if (period === "this-month") {
    return `${fmtDisplayDate(new Date(y, m, 1))} - ${fmtDisplayDate(new Date(y, m + 1, 0))}`;
  }

  if (period === "last-month") {
    return `${fmtDisplayDate(new Date(y, m - 1, 1))} - ${fmtDisplayDate(new Date(y, m, 0))}`;
  }

  return "—";
}

export function paramsFromSummaryPeriod(
  period: SummaryPeriod,
): SavingsQueryParams {
  const now = new Date();
  const today = toIsoDate(now);

  if (period === "daily") {
    return { date: today };
  }

  if (period === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return {
      date: today,
      startDate: toIsoDate(start),
      endDate: today,
    };
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    date: today,
    startDate: toIsoDate(monthStart),
    endDate: today,
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
  const today = toIsoDate(now);

  if (calcPeriod === "this-week") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    return {
      date: today,
      startDate: toIsoDate(weekStart),
      endDate: today,
    };
  }

  if (calcPeriod === "this-month") {
    return {
      date: today,
      startDate: toIsoDate(new Date(y, m, 1)),
      endDate: today,
    };
  }

  if (calcPeriod === "last-month") {
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return {
      date: toIsoDate(end),
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
    };
  }

  if (calcPeriod === "custom") {
    if (!data.customStartDate || !data.customEndDate) return null;
    return {
      date: data.customEndDate,
      startDate: data.customStartDate,
      endDate: data.customEndDate,
    };
  }

  return null;
}

export function defaultResultsQueryParams(): SavingsQueryParams {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  return {
    date: toIsoDate(now),
    startDate: toIsoDate(weekStart),
    endDate: toIsoDate(now),
  };
}

export function formatSavingsChartLabel(
  isoLabel: string,
  granularity?: string,
): string {
  const date = new Date(isoLabel);
  if (Number.isNaN(date.getTime())) return isoLabel;

  if (granularity === "hour") {
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

export function breakdownTitleFromGranularity(granularity?: string): string {
  if (granularity === "hour") return "Hourly cost breakdown";
  if (granularity === "day") return "Daily cost breakdown";
  if (granularity === "week") return "Weekly cost breakdown";
  if (granularity === "month") return "Monthly cost breakdown";
  return "Period cost breakdown";
}
