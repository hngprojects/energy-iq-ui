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

export function getCalculatorPeriodDayCount(
  period: CalculationPeriod,
  customStartDate?: string,
  customEndDate?: string,
): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === "custom" && customStartDate && customEndDate) {
    const start = parseDateString(customStartDate);
    const end = parseDateString(customEndDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  if (period === "this-week") return 7;

  if (period === "this-month") return now.getDate();

  if (period === "last-month") return new Date(y, m, 0).getDate();

  return 7;
}

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

export function defaultResultsQueryParams(): SavingsQueryParams {
  return {
    period: "weekly",
    date: toIsoDate(new Date()),
  };
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
