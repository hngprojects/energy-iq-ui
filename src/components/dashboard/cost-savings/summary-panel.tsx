"use client";

import { Zap, Sun, Fuel, Activity, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SummaryPeriod } from "./cost-savings-tabs";
import { StatCard } from "./cards/stat-card";
import { useSavingsMetrics } from "./savings-metrics-context";
import { formatSavingsChartLabel } from "@/lib/savings-query-params";

interface SummaryPanelProps {
  period: SummaryPeriod;
  onCheckCalculator?: () => void;
}

function formatAxisNaira(value: number): string {
  if (value === 0) return "₦0k";
  if (value >= 1000) return `₦${Math.round(value / 1000)}k`;
  return `₦${Math.round(value)}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold text-foreground">
        {formatNaira(payload[0].value)}
      </p>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  );
}

export function SummaryPanel({ period, onCheckCalculator }: SummaryPanelProps) {
  const { data, isLoading, isError, hasInverter, queryParams } =
    useSavingsMetrics();

  const chart = data?.chart ?? [];
  const trendData = chart.length
    ? chart.map((point) => ({
        label: formatSavingsChartLabel(point.label, queryParams.period),
        value: point.savingsNgn,
      }))
    : [];

  const minLabel = trendData.length
    ? trendData[
        trendData.reduce(
          (minI, d, i, arr) => (d.value < arr[minI].value ? i : minI),
          0,
        )
      ]?.label
    : undefined;

  const totalSaved = data?.results?.totalCostSavedNgn;
  const energyConsumed = data?.summary?.totalEnergyConsumedKwh;
  const solarGeneration = data?.solarGenerationKwh;

  if (!hasInverter && !isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">
          No inverter connected
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your inverter to view cost and savings data.
        </p>
      </div>
    );
  }

  if (isLoading && !data) {
    return <SummarySkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <p className="mt-3 text-sm font-medium text-foreground">
          Could not load savings data
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Energy summary"
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Saved"
          value={
            totalSaved != null ? formatNaira(totalSaved) : "—"
          }
          iconBg="bg-amber-light"
          icon={<Fuel className="h-5 w-5 text-amber-60" />}
        />
        <StatCard
          label="Energy consumed"
          value={
            energyConsumed != null
              ? `${energyConsumed.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh`
              : "—"
          }
          iconBg="bg-[#ede9fe]"
          icon={<Activity className="h-5 w-5 text-[#7c3aed]" />}
        />
        <StatCard
          label={period === "daily" ? "Generation Today" : "Solar Generation"}
          value={
            solarGeneration != null && solarGeneration > 0
              ? `${solarGeneration.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh`
              : "—"
          }
          iconBg="bg-[#fce7f3]"
          icon={<Zap className="h-5 w-5 text-[#db2777]" />}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Savings Trend</h2>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {period === "daily"
                ? "Daily"
                : period === "weekly"
                  ? "Weekly"
                  : "Monthly"}{" "}
              total savings compared to generator
            </p>
          </div>
        </div>

        <div className="h-72">
          {trendData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <LineChart
                data={trendData}
                margin={{ left: 10, right: 16, top: 16, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                  padding={{ left: 20, right: 40 }}
                />
                <YAxis
                  tickFormatter={formatAxisNaira}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tickMargin={8}
                />
                <Tooltip content={<ChartTooltip />} />
                {minLabel ? (
                  <ReferenceLine
                    x={minLabel}
                    stroke="var(--border)"
                    strokeDasharray="4 4"
                  />
                ) : null}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#15803d"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#15803d" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No chart data for this period.
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={onCheckCalculator}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto"
          >
            Check Calculator
          </Button>

          {(totalSaved ?? 0) > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-2.5 text-xs text-[#15803d] font-medium flex-1 sm:ml-3">
              <Sun className="h-4 w-4 shrink-0 text-primary" />
              You saved {formatNaira(totalSaved!)} this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
