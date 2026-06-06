"use client";

import { useMemo } from "react";
import { ArrowRight, RefreshCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useCalculator } from "../calculator/calculator-context";
import { useSavingsSetup } from "../savings-setup-context";
import { SavingsCard } from "./primitives";
import { DailyCostBreakdownCard } from "./daily-cost-breakdown-card";
import { DailyBarChartCard } from "./daily-bar-chart-card";

interface ResultsPanelProps {
  onViewCumulativeTracker?: () => void;
  onRecalculate?: () => void;
  onExportPdf?: () => void;
}

export function ResultsPanel({
  onViewCumulativeTracker,
  onRecalculate,
  onExportPdf,
}: ResultsPanelProps = {}) {
  const { data: calcData } = useCalculator();
  const { preferences } = useSavingsSetup();
  const {
    useUserInverters,
    useDashboardMetrics,
    useCumulativeSavings,
    useEnergyUsage,
  } = useInverterQueries();

  const { data: inverters, isLoading: invertersLoading } = useUserInverters();
  const inverterId = inverters?.[0]?.id;

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(inverterId);
  const { data: cumulative, isLoading: cumulativeLoading } = useCumulativeSavings(inverterId);
  const { data: dailyUsage, isLoading: dailyLoading } = useEnergyUsage(inverterId, "daily");

  const generatorType = preferences?.generatorType ?? "petrol";
  const fuelPrice =
    calcData.pmsPricePerLitre ??
    preferences?.fuelPricePerLitre ??
    cumulative?.meta?.fuelPricePerLitreNgn ??
    897;

  const isApiFuelMatch =
    !!cumulative?.meta?.fuelType &&
    ((generatorType === "diesel" &&
      (cumulative.meta.fuelType.toUpperCase() === "AGO" ||
        cumulative.meta.fuelType.toLowerCase() === "diesel")) ||
     (generatorType === "petrol" &&
      (cumulative.meta.fuelType.toUpperCase() === "PMS" ||
        cumulative.meta.fuelType.toLowerCase() === "petrol")));

  const litresPerHour = isApiFuelMatch && cumulative?.meta?.assumedConsumptionRateLPerHr
    ? cumulative.meta.assumedConsumptionRateLPerHr
    : (generatorType === "diesel" ? 2.5 : 1.3);

  const generatorPowerKw =
    cumulative?.meta?.assumedGeneratorRatedPowerKw ?? 5.0;

  const hoursBefore = preferences?.generatorHoursPerDay ?? 8;

  const period = calcData.period ?? "this-week";
  const periodLabel =
    period === "this-week"
      ? "this week"
      : period === "this-month"
        ? "this month"
        : period === "last-month"
          ? "last month"
          : "selected period";

  const numDays = useMemo(() => {
    if (period === "this-week") return 7;
    if (period === "this-month" || period === "last-month") return 30;
    if (period === "custom" && calcData.customStartDate && calcData.customEndDate) {
      const diff =
        new Date(calcData.customEndDate).getTime() -
        new Date(calcData.customStartDate).getTime();
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 7;
  }, [period, calcData.customStartDate, calcData.customEndDate]);

  // Compute stats
  const stats = useMemo(() => {
    const dailyPoints = dailyUsage?.data || [];
    const generatorCostPerKwh = (fuelPrice * litresPerHour) / generatorPowerKw;
    const dailyGenCost = hoursBefore * litresPerHour * fuelPrice;

    // Filter points based on selected period
    const now = new Date();
    let filtered = dailyPoints;

    if (period === "this-week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filtered = dailyPoints.filter((p) => new Date(p.date) >= sevenDaysAgo);
    } else if (period === "this-month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = dailyPoints.filter((p) => new Date(p.date) >= startOfMonth);
    } else if (period === "last-month") {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      filtered = dailyPoints.filter((p) => {
        const d = new Date(p.date);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      });
    } else if (
      period === "custom" &&
      calcData.customStartDate &&
      calcData.customEndDate
    ) {
      const start = new Date(calcData.customStartDate);
      const end = new Date(calcData.customEndDate);
      filtered = dailyPoints.filter((p) => {
        const d = new Date(p.date);
        return d >= start && d <= end;
      });
    }

    const defaultDailySolarKwh = 15;
    const defaultDailySavings = defaultDailySolarKwh * generatorCostPerKwh;

    if (filtered.length === 0) {
      const totalSavings = defaultDailySavings * numDays;
      const originalCost = dailyGenCost * numDays;
      const pct = originalCost > 0 ? (totalSavings / originalCost) * 100 : 60;
      return {
        totalSavingsNgn: totalSavings,
        savingsPct: Math.min(100, pct),
        co2AvoidedKg: (totalSavings / fuelPrice) * (generatorType === "diesel" ? 2.68 : 2.31),
        avgSolarKwh: defaultDailySolarKwh,
      };
    }

    const totalSolarKwh = filtered.reduce((sum, p) => sum + (p.solarKwh ?? 0), 0);
    const totalSavings = totalSolarKwh * generatorCostPerKwh;
    const originalCost = dailyGenCost * filtered.length;
    const pct = originalCost > 0 ? (totalSavings / originalCost) * 100 : 60;

    return {
      totalSavingsNgn: totalSavings,
      savingsPct: Math.min(100, pct),
      co2AvoidedKg: (totalSavings / fuelPrice) * (generatorType === "diesel" ? 2.68 : 2.31),
      avgSolarKwh: totalSolarKwh / filtered.length,
    };
  }, [
    dailyUsage?.data,
    period,
    calcData.customStartDate,
    calcData.customEndDate,
    fuelPrice,
    litresPerHour,
    generatorPowerKw,
    hoursBefore,
    generatorType,
    numDays,
  ]);

  const hoursSaved = Math.min(hoursBefore, stats.avgSolarKwh / generatorPowerKw);
  const hoursAfter = Math.max(0, hoursBefore - hoursSaved);
  const activeHours = hoursSaved;

  const barChartData = useMemo(() => {
    const dailyPoints = dailyUsage?.data || [];
    const generatorCostPerKwh = (fuelPrice * litresPerHour) / generatorPowerKw;
    const dailyGenCost = hoursBefore * litresPerHour * fuelPrice;

    // Build a lookup map from dailyUsage data: dateStr -> EnergyUsagePoint
    const dataMap = new Map<string, { solarKwh: number }>();
    for (const point of dailyPoints) {
      const key = new Date(point.date).toISOString().split("T")[0];
      dataMap.set(key, point);
    }

    // Determine the date range based on the selected period
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === "this-week") {
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    } else if (period === "this-month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now);
    } else if (period === "last-month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0); // last day of prev month
    } else if (period === "custom" && calcData.customStartDate && calcData.customEndDate) {
      startDate = new Date(calcData.customStartDate);
      endDate = new Date(calcData.customEndDate);
    } else {
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
    }

    // Generate every day in the range
    const allDays: Date[] = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      allDays.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const totalDays = allDays.length;
    const hasAnyRealData = dailyPoints.length > 0;

    // For short ranges (≤14 days), show individual days.
    // For longer ranges, aggregate into weekly buckets for readability.
    if (totalDays <= 14) {
      return allDays.map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const label = totalDays <= 7
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const point = dataMap.get(dateStr);
        if (point) {
          const dailySolarSavings = point.solarKwh * generatorCostPerKwh;
          return {
            day: label,
            savings: Math.min(dailySolarSavings, dailyGenCost),
            petrol: dailyGenCost,
          };
        }

        return {
          day: label,
          savings: hasAnyRealData ? 0 : Math.min(dailyGenCost, 15 * generatorCostPerKwh),
          petrol: dailyGenCost,
        };
      });
    }

    // Aggregate into weekly buckets for month-length ranges
    const weekBuckets: { label: string; totalSolarKwh: number; daysWithData: number; totalDays: number }[] = [];
    let bucketStart = 0;

    while (bucketStart < totalDays) {
      const bucketEnd = Math.min(bucketStart + 6, totalDays - 1);
      const bucketStartDate = allDays[bucketStart];
      const bucketEndDate = allDays[bucketEnd];

      const label = `${bucketStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      let totalSolarKwh = 0;
      let daysWithData = 0;
      for (let i = bucketStart; i <= bucketEnd; i++) {
        const dateStr = allDays[i].toISOString().split("T")[0];
        const point = dataMap.get(dateStr);
        if (point) {
          totalSolarKwh += point.solarKwh;
          daysWithData++;
        }
      }

      weekBuckets.push({
        label,
        totalSolarKwh,
        daysWithData,
        totalDays: bucketEnd - bucketStart + 1,
      });

      bucketStart = bucketEnd + 1;
    }

    return weekBuckets.map((bucket) => {
      const bucketGenCost = dailyGenCost * bucket.totalDays;
      if (bucket.daysWithData > 0) {
        const bucketSavings = bucket.totalSolarKwh * generatorCostPerKwh;
        return {
          day: bucket.label,
          savings: Math.min(bucketSavings, bucketGenCost),
          petrol: bucketGenCost,
        };
      }
      return {
        day: bucket.label,
        savings: hasAnyRealData ? 0 : Math.min(bucketGenCost, 15 * generatorCostPerKwh * bucket.totalDays),
        petrol: bucketGenCost,
      };
    });
  }, [dailyUsage?.data, period, calcData.customStartDate, calcData.customEndDate, fuelPrice, litresPerHour, generatorPowerKw, hoursBefore]);

  if (invertersLoading || metricsLoading || cumulativeLoading || dailyLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
        <RefreshCw className="animate-spin size-6 text-primary" />
        <span>Loading calculator results...</span>
      </div>
    );
  }

  const savingsCardLabel =
    period === "this-week"
      ? "Weekly Savings"
      : period === "this-month" || period === "last-month"
        ? "Monthly Savings"
        : "Daily Savings";

  const fuelName = generatorType === "diesel" ? "AGO" : "Petrol";
  const chartSubtitle =
    period === "this-week"
      ? `Daily ₦ savings this week vs ${fuelName.toLowerCase()} gen cost`
      : period === "this-month"
        ? `₦ savings this month vs ${fuelName.toLowerCase()} gen cost`
        : period === "last-month"
          ? `₦ savings last month vs ${fuelName.toLowerCase()} gen cost`
          : `₦ savings for selected range vs ${fuelName.toLowerCase()} gen cost`;

  const dailySavingsEst = metrics?.nairaSavedToday ?? (stats.totalSavingsNgn / numDays);

  return (
    <section aria-label="Savings results" className="w-full min-w-0 overflow-hidden pb-8">
      {/* ── Heading ── */}
      <h2 className="mt-6 text-[18px] lg:text-[20px] font-medium leading-none text-foreground">
        Your saving results
      </h2>
      <p className="mt-2 text-[13px] lg:text-sm font-normal leading-none text-grey">
        {generatorType.charAt(0).toUpperCase() + generatorType.slice(1)} {litresPerHour} L/hr · {hoursBefore} hrs before / {hoursAfter.toFixed(1).replace(/\.0$/, "")} hrs now
      </p>

      {/* ── Summary ── */}
      <div className="mt-8 lg:mt-10 grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <SavingsCard
          label={savingsCardLabel}
          value={`₦${Math.round(stats.totalSavingsNgn).toLocaleString()}`}
          note={`Sum for ${periodLabel}`}
        />
        <SavingsCard
          label="Generator Cost Avoided"
          value={`₦${Math.round(stats.totalSavingsNgn).toLocaleString()}`}
          note="Based on solar offset"
        />
        <SavingsCard
          label="Savings Percentage"
          value={`${stats.savingsPct.toFixed(0)}%`}
          note={`Saved vs generator (${periodLabel})`}
        />
        <SavingsCard
          label="CO2 avoided"
          value={`${stats.co2AvoidedKg.toFixed(0)} kg`}
          note={`Avoided for ${periodLabel}`}
        />
      </div>

      {/* ── Bar chart + Daily cost breakdown ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8 lg:mt-10.25">
        <DailyBarChartCard data={barChartData} generatorType={generatorType} subtitle={chartSubtitle} />
        <DailyCostBreakdownCard
          activeHours={activeHours}
          equivalentPowerKwh={stats.avgSolarKwh}
          generatorCostSavedNgn={dailySavingsEst}
          generatorType={generatorType}
        />
      </div>

      {/* ── Action bar ── */}
      <div
        className={cn(
          "flex flex-col gap-3",
          "sm:flex-row sm:flex-wrap sm:gap-3",
          "lg:gap-0 lg:justify-between",
          "mt-6 lg:mt-9.25",
        )}
      >
        <Button
          variant="secondary"
          className="h-10 gap-1.5 text-surface-20 rounded-lg px-4 w-full sm:w-auto lg:w-69.5"
          onClick={onViewCumulativeTracker}
        >
          View cumulative saving tracker
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-1.5 rounded-lg border-slate-60 text-foreground px-4 w-full sm:w-auto lg:w-71"
          onClick={onRecalculate}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Recalculate
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-lg border-slate-60 text-foreground px-4 w-full sm:w-auto lg:w-71"
          onClick={onExportPdf}
        >
          <Download className="size-4" aria-hidden="true" />
          Export PDF report
        </Button>
      </div>
    </section>
  );
}
