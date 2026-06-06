"use client";

import { AlertCircle, ArrowRight, RefreshCw, Download } from "lucide-react";
import { cn, formatNairaOrDash } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  breakdownTitleFromGranularity,
  formatSavingsChartLabel,
  getCalculatorPeriodDateRange,
  getCalculatorPeriodLabel,
} from "@/lib/savings-query-params";
import type { CalculationPeriod } from "../calculator/calculator-context";
import { useCalculator } from "../calculator/calculator-context";
import { formatFuelLabel } from "@/lib/savings-personal-settings";
import { useSavingsMetrics } from "../savings-metrics-context";
import { SavingsCard } from "./primitives";
import { DailyCostBreakdownCard } from "./daily-cost-breakdown-card";
import { DailyBarChartCard } from "./daily-bar-chart-card";

interface ResultsPanelProps {
  onViewCumulativeTracker?: () => void;
  onRecalculate?: () => void;
}

function formatKg(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(0)} kg`;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(0)}%`;
}

export function ResultsPanel({
  onViewCumulativeTracker,
  onRecalculate,
}: ResultsPanelProps = {}) {
  const { data: calcData } = useCalculator();
  const { data, isLoading, isError, hasInverter } = useSavingsMetrics();

  const effectivePeriod: CalculationPeriod = calcData.period ?? "this-week";
  const periodLabel = getCalculatorPeriodLabel(effectivePeriod);
  const periodRange =
    data?.startDate && data?.endDate
      ? `${data.startDate} – ${data.endDate}`
      : getCalculatorPeriodDateRange(
          effectivePeriod,
          calcData.customStartDate,
          calcData.customEndDate,
        );

  const meta = data?.meta;
  const granularity = data?.granularity;
  const fuelName = formatFuelLabel(meta?.fuelType);

  const chartPoints = data?.chart ?? [];

  const barChartData = chartPoints.map((point) => ({
    day: formatSavingsChartLabel(point.label, granularity),
    savings: point.savingsNgn,
    petrol: point.generatorCostNgn,
  }));

  const savingsCardLabel =
    effectivePeriod === "this-week"
      ? "Weekly Savings"
      : effectivePeriod === "this-month" || effectivePeriod === "last-month"
        ? "Monthly Savings"
        : "Period Savings";

  const breakdownTitle = breakdownTitleFromGranularity(granularity);

  const chartSubtitle =
    effectivePeriod === "this-week"
      ? `Daily ₦ savings this week vs ${fuelName.toLowerCase()} gen cost`
      : effectivePeriod === "this-month"
        ? `₦ savings this month vs ${fuelName.toLowerCase()} gen cost`
        : effectivePeriod === "last-month"
          ? `₦ savings last month vs ${fuelName.toLowerCase()} gen cost`
          : `₦ savings for ${periodRange} vs ${fuelName.toLowerCase()} gen cost`;

  const generatorSpec = meta
    ? `${meta.fuelType} ${meta.assumedConsumptionRateLPerHr} L/hr · ${meta.assumedGeneratorRatedPowerKw} kW`
    : null;

  if (!hasInverter && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">
          No inverter connected
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your inverter to view calculator results.
        </p>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className="size-6 animate-spin text-primary" />
        <span>Loading calculator results...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Could not load savings results
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  const results = data?.results;
  const summary = data?.summary;

  return (
    <section aria-label="Savings results" className="w-full min-w-0 overflow-hidden pb-8">
      <h2 className="mt-6 text-[18px] font-medium leading-none text-foreground lg:text-[20px]">
        Your saving results
      </h2>
      <p className="mt-2 text-[13px] font-normal leading-none text-grey lg:text-sm">
        {periodLabel} · {periodRange}
      </p>
      {generatorSpec ? (
        <p className="mt-1 text-[13px] font-normal leading-none text-grey lg:text-sm">
          {generatorSpec}
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
        <SavingsCard
          label={savingsCardLabel}
          value={formatNairaOrDash(results?.totalCostSavedNgn)}
          note={`Sum for ${periodLabel.toLowerCase()}`}
        />
        <SavingsCard
          label="Generator Cost Avoided"
          value={formatNairaOrDash(results?.generatorCostAvoidedNgn)}
          note="Based on solar offset"
        />
        <SavingsCard
          label="Savings Percentage"
          value={formatPercent(results?.savingsPercentagePercent)}
          note={`Saved vs generator (${periodLabel.toLowerCase()})`}
        />
        <SavingsCard
          label="CO2 avoided"
          value={formatKg(results?.co2AvoidedKg)}
          note={`Avoided for ${periodLabel.toLowerCase()}`}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6 lg:mt-10.25">
        <DailyBarChartCard
          data={barChartData}
          fuelName={fuelName}
          subtitle={chartSubtitle}
        />
        <DailyCostBreakdownCard
          title={breakdownTitle}
          activeHours={summary?.totalActiveHours}
          equivalentPowerKwh={summary?.totalEnergyGeneratedKwh}
        />
      </div>

      <div
        className={cn(
          "mt-6 flex flex-col gap-3",
          "sm:flex-row sm:flex-wrap sm:gap-3",
          "lg:mt-9.25 lg:justify-between lg:gap-0",
        )}
      >
        <Button
          variant="secondary"
          className="h-10 w-full gap-1.5 rounded-lg px-4 text-surface-20 sm:w-auto lg:w-69.5"
          onClick={onViewCumulativeTracker}
        >
          View Cumulative Savings Track
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <Button
          variant="outline"
          className="h-10 w-full gap-1.5 rounded-lg border-slate-60 px-4 text-foreground sm:w-auto lg:w-71"
          onClick={onRecalculate}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Recalculate
        </Button>

        <Button
          variant="outline"
          className="h-10 w-full gap-2 rounded-lg border-slate-60 px-4 text-foreground sm:w-auto lg:w-71"
          disabled
        >
          <Download className="size-4" aria-hidden="true" />
          Export PDF report
        </Button>
      </div>
    </section>
  );
}
