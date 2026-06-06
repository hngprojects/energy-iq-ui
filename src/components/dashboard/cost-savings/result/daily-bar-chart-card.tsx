"use client";

import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DailyBarChartCardProps {
  data: {
    day: string;
    savings: number;
    petrol: number;
  }[];
  generatorType?: string;
  subtitle?: string;
}

export function DailyBarChartCard({ data, generatorType = "PMS", subtitle }: DailyBarChartCardProps) {
  const fuelName = generatorType.toUpperCase() === "DIESEL" || generatorType.toLowerCase() === "ago" ? "AGO" : "Petrol";

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        "w-full lg:flex-1",
        "px-3.75 pb-4",
      )}
    >
      {/* Title */}
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Savings vs Generator Cost
      </h3>

      {/* Subtitle */}
      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "4px" }}
      >
        {subtitle ?? `Daily ₦ savings this week vs ${fuelName.toLowerCase()} gen cost`}
      </p>

      {/* Chart */}
      <div className="mt-6 w-full h-35 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={4}
            barCategoryGap="30%"
            margin={{ top: 4, right: 0, left: -28, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
              tickFormatter={(v: number | undefined) => v != null ? `₦${(v / 1000).toFixed(0)}k` : ""}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              formatter={(value: string | number | readonly (string | number)[] | undefined, name: string | number | undefined): [string, string] => [
                `₦${Number(Array.isArray(value) ? value[0] : (value ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                name === "savings" ? "Solar savings" : `${fuelName} cost`,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: "11px",
              }}
            />
            {/* Petrol AGO AGO AGO AGO AGO/PMS cost */}
            <Bar dataKey="petrol"  fill="var(--color-amber-60)" radius={[3, 3, 0, 0]} />
            {/* Solar savings — amber-30 */}
            <Bar dataKey="savings" fill="var(--color-amber-30)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-60" />
          {fuelName} cost
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-30" />
          Solar savings
        </span>
      </div>
    </div>
  );
}
