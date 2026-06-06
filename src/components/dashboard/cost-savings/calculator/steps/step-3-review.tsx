"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  Fuel,
  Pencil,
} from "lucide-react";
import { useSavingsSetup } from "@/components/dashboard/cost-savings/savings-setup-context";
import { DEFAULT_FUEL_PRICE } from "@/types/savings-setup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCalculator,
  type CalculationPeriod,
} from "../calculator-context";

const PERIOD_LABELS: Record<CalculationPeriod, string> = {
  "this-week": "This Week",
  "this-month": "This Month",
  "last-month": "Last Month",
  custom: "Custom Range",
};

function parseDateString(dateString: string): Date {
  const hasTime = /[Tt]/.test(dateString) || dateString.endsWith("Z");
  return new Date(hasTime ? dateString : `${dateString}T00:00:00`);
}

function fmtDate(dateString: string) {
  const d = parseDateString(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPeriodDateRange(
  period: CalculationPeriod,
  customStartDate?: string,
  customEndDate?: string,
): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (period === "custom" && customStartDate && customEndDate) {
    return `${fmtDate(customStartDate)} - ${fmtDate(customEndDate)}`;
  }

  if (period === "this-week") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${fmt(weekStart)} - ${fmt(weekEnd)}`;
  }

  if (period === "this-month") {
    return `${fmt(new Date(y, m, 1))} - ${fmt(new Date(y, m + 1, 0))}`;
  }

  if (period === "last-month") {
    return `${fmt(new Date(y, m - 1, 1))} - ${fmt(new Date(y, m, 0))}`;
  }

  return "—";
}

function formatSavedTimestamp(savedAt?: string) {
  if (!savedAt) return "From your savings setup";
  const d = new Date(savedAt);
  if (Number.isNaN(d.getTime())) return "From your savings setup";
  return `Saved ${d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

interface ReviewRowProps {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  value: string;
  meta?: string;
}

function ReviewInputRow({
  icon,
  iconClassName,
  title,
  description,
  value,
  meta,
}: ReviewRowProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 sm:px-5">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="mt-1 text-sm font-semibold text-foreground sm:hidden">
          {value}
        </p>
        {meta ? (
          <p className="text-xs text-muted-foreground sm:hidden">{meta}</p>
        ) : null}
      </div>

      <div className="hidden min-w-0 text-right sm:block">
        <p className="text-sm font-semibold text-foreground">{value}</p>
        {meta ? (
          <p className="text-xs text-muted-foreground">{meta}</p>
        ) : null}
      </div>
    </div>
  );
}

interface Step3ReviewProps {
  onBack?: () => void;
}

function formatGeneratorType(type?: "petrol" | "diesel") {
  if (type === "petrol") return "Petrol";
  if (type === "diesel") return "Diesel";
  return "Not set";
}

export function Step3Review({ onBack }: Step3ReviewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, goBack } = useCalculator();
  const { preferences } = useSavingsSetup();

  const handleEditSetup = () => {
    router.push("/dashboard/settings/profile");
  };

  const period = data.period ?? "this-week";
  const pmsPrice =
    data.pmsPricePerLitre ??
    preferences?.fuelPricePerLitre ??
    DEFAULT_FUEL_PRICE;
  const fuelTitle =
    preferences?.generatorType === "diesel"
      ? "Diesel (AGO) Price"
      : "Petrol (PMS) Price";
  const fuelPriceMeta =
    data.pmsPricePerLitre != null
      ? "Adjusted for this calculation"
      : formatSavedTimestamp(
          preferences?.fuelPricePerLitre != null && !preferences?.skipped
            ? preferences.updatedAt
            : undefined,
        );

  const periodLabel = PERIOD_LABELS[period];
  const periodRange = getPeriodDateRange(
    period,
    data.customStartDate,
    data.customEndDate,
  );

  const handleContinue = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "results");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Review Your Input
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please review the information below. You can edit any input if
                needed.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleEditSetup}
              className="shrink-0 gap-2 border-primary text-primary hover:bg-primary/5"
            >
              <Pencil className="h-4 w-4" />
              Edit setup
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <ReviewInputRow
              icon={<Calculator className="h-5 w-5 text-blue-600" />}
              iconClassName="bg-blue-50"
              title="Calculation Period"
              description="This time period used for this Calculation"
              value={periodLabel}
              meta={periodRange}
            />
            <ReviewInputRow
              icon={<Fuel className="h-5 w-5 text-sky-600" />}
              iconClassName="bg-sky-50"
              title="Generator Type"
              description="Petrol and diesel use different calculations"
              value={formatGeneratorType(preferences?.generatorType)}
              meta="From your savings setup"
            />
            <ReviewInputRow
              icon={<Fuel className="h-5 w-5 text-violet-600" />}
              iconClassName="bg-violet-50"
              title={fuelTitle}
              description="Fuel price used for this calculation"
              value={`₦${pmsPrice.toLocaleString()} / litre`}
              meta={fuelPriceMeta}
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <AlertCircle className="h-4 w-4 text-white" />
            </span>
            <p className="text-sm font-medium text-primary">
              These inputs can be updated anytime for more accurate savings
              calculation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack ?? goBack}
          className="gap-2 px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="gap-2 bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
