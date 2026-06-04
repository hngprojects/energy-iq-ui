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
import { WEEKLY_BAR_DATA } from "@/lib/mocks/cost-savings-results";


export function DailyBarChartCard() {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden",
        "w-full lg:flex-1",
        "px-3.75 pb-4",
      )}
      style={{ borderColor: "#D8DBE2", borderWidth: "1px" }}
    >
      {/* Title */}
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Daily cost breakdown
      </h3>

      {/* Subtitle */}
      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "4px" }}
      >
        Daily ₦ savings this week vs petrol gen cost
      </p>

      {/* Chart */}
      <div className="mt-6 w-full h-35 sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={WEEKLY_BAR_DATA}
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
              tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              formatter={(value: string | number | (string | number)[], name: string | number): [string, string] => [
                `₦${Number(Array.isArray(value) ? value[0] : value ?? 0).toLocaleString()}`,
                name === "savings" ? "Solar savings" : "Petrol cost",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: "11px",
              }}
            />
            {/* Petrol gen cost */}
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
          Petrol cost
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-30" />
          Solar savings
        </span>
      </div>
    </div>
  );
}
