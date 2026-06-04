"use client";

import { Zap, Sun, Fuel, Activity } from "lucide-react";
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
import { TREND_DATA, STATS } from "@/constants/cost-savings";
import { StatCard } from "./cards/stat-card";

interface SummaryPanelProps {
  period: SummaryPeriod;
  onCheckCalculator?: () => void;
}

const getPeriodLabel = (period: SummaryPeriod): string => {
  switch (period) {
    case "daily":
      return "day";
    case "weekly":
      return "week";
    case "monthly":
      return "month";
  }
};

function formatAxisNaira(value: number): string {
  if (value === 0) return "₦0k";
  return `₦${value / 1000}k`;
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

export function SummaryPanel({ period, onCheckCalculator }: SummaryPanelProps) {
  const stats = STATS[period];
  const trendData = TREND_DATA[period];
  const periodLabel = getPeriodLabel(period);

  const minIdx = trendData.reduce(
    (minI, d, i, arr) => (d.value < arr[minI].value ? i : minI),
    0,
  );
  const minLabel = trendData[minIdx].label;

  return (
    <div
      role="region"
      aria-label="Energy summary"
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Saved"
          value={formatNaira(stats.totalSaved)}
          delta={stats.totalSavedDelta}
          deltaLabel={`${formatNaira(Math.abs(stats.totalSavedDelta))} vs last ${periodLabel}`}
          iconBg="bg-amber-light"
          icon={<Fuel className="h-5 w-5 text-amber-60" />}
        />
        <StatCard
          label="Energy consumed"
          value={`${stats.energyConsumed} kWh`}
          delta={stats.energyDelta}
          deltaLabel={`${Math.abs(stats.energyDelta)}% vs last ${periodLabel}`}
          iconBg="bg-[#ede9fe]"
          icon={<Activity className="h-5 w-5 text-[#7c3aed]" />}
        />
        <StatCard
          label={period === "daily" ? "Generation Today" : "Solar Generation"}
          value={`${stats.solarGeneration} kWh`}
          delta={stats.solarGenerationDelta}
          deltaLabel={`${Math.abs(stats.solarGenerationDelta)} kWh vs last ${periodLabel}`}
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
              <ReferenceLine
                x={minLabel}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#15803d"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#15803d" }}
                label={({
                  x,
                  y,
                  value,
                }: {
                  x?: string | number;
                  y?: string | number;
                  value?: string | number | boolean | null;
                }) => (
                  <text
                    x={x}
                    y={typeof y === "number" ? y - 12 : 0}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#15803d"
                    fontWeight={600}
                  >
                    {typeof value === "number" ? formatAxisNaira(value) : ""}
                  </text>
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={onCheckCalculator}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto"
          >
            Check Calculator
          </Button>

          {stats.totalSavedDelta > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-2.5 text-xs text-[#15803d] font-medium flex-1 sm:ml-3">
              <Sun className="h-4 w-4 shrink-0 text-primary" />
              Your savings increased due to high solar output
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
