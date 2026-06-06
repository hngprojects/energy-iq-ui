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
    petrol?: number;
  }[];
  fuelName?: string;
  subtitle?: string;
}

export function DailyBarChartCard({
  data,
  fuelName = "Petrol",
  subtitle,
}: DailyBarChartCardProps) {
  const hasData = data.length > 0;
  const showGeneratorCost = data.some((row) => row.petrol != null);

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        "w-full min-w-0 lg:flex-1",
        "px-3.75 pb-4",
      )}
    >
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Savings vs Generator Cost
      </h3>

      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "4px" }}
      >
        {subtitle ?? `Daily ₦ savings this week vs ${fuelName.toLowerCase()} gen cost`}
      </p>

      <div className="mt-6 h-[140px] w-full min-h-[140px] min-w-0 overflow-hidden sm:h-[160px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart
              data={data}
              barGap={4}
              barCategoryGap={data.length > 14 ? "10%" : "30%"}
              margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: data.length > 14 ? 8 : 10 }}
                interval={data.length > 14 ? "preserveStartEnd" : 0}
                angle={data.length > 14 ? -35 : 0}
                textAnchor={data.length > 14 ? "end" : "middle"}
                height={data.length > 14 ? 48 : 30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                width={40}
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
              {showGeneratorCost ? (
                <Bar dataKey="petrol" fill="var(--color-amber-60)" radius={[3, 3, 0, 0]} />
              ) : null}
              <Bar dataKey="savings" fill="var(--color-amber-30)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No chart data for this period.
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-4">
        {showGeneratorCost ? (
          <span className="flex items-center gap-1.5 text-[11px] text-grey">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-60" />
            {fuelName} cost
          </span>
        ) : null}
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-30" />
          Solar savings
        </span>
      </div>
    </div>
  );
}
