import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const LIFETIME_SAVINGS_DATA = [
  { month: "JAN",  actual: 45000,  projected: 40000  },
  { month: "FEB",  actual: 98000,  projected: 82000  },
  { month: "MAR",  actual: 162000, projected: 125000 },
  { month: "APR",  actual: 240000, projected: 170000 },
  { month: "MAY",  actual: 335000, projected: 218000 },
  { month: "JUN",  actual: 448000, projected: 268000 },
  { month: "JUL",  actual: 572000, projected: 320000 },
  { month: "AUG",  actual: 710000, projected: 374000 },
  { month: "SEP",  actual: 865000, projected: 430000 },
  { month: "OCT",  actual: 1020000,projected: 488000 },
  { month: "NOV",  actual: 1150000,projected: 548000 },
  { month: "DEC",  actual: 1200000,projected: 610000 },
];

export function CumulativeSavingsChart() {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[8.87px] border bg-card overflow-hidden w-full lg:flex-1 lg:max-w-183.25 p-4 sm:p-6 lg:p-[26.61px] border-amber-80",
      )}
    >
      <h3 className="leading-normal font-medium text-[18px] lg:text-[20px] truncate text-foreground">
        Cumulative Savings Growth
      </h3>

      <p className="leading-normal font-medium text-[12px] truncate mt-2 text-muted-foreground">
        Historical performance vs. grid projection
      </p>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
          Actual savings
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-slate-50" />
          Grid projection
        </span>
      </div>

      <div className="relative w-full mt-[37.7px] h-55 sm:h-70 lg:h-88.75">
        <p
          className="absolute left-0 text-[11px] font-medium leading-none pointer-events-none z-10 whitespace-nowrap text-amber-30"
          style={{ top: "58px" }}
        >
          Historical performance vs. grid projections
        </p>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={LIFETIME_SAVINGS_DATA}
            margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="actualFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--color-amber-50)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-amber-50)" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="projectedFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--color-slate-50)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-slate-50)" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--border)"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--color-primary)",
                fontSize: 11.09,
                fontWeight: 700,
                letterSpacing: "-0.55px",
                fontFamily: "var(--font-sans)",
              }}
            />
            <YAxis
              width={52}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "var(--font-sans)",
              }}
              tickFormatter={(v: number | undefined) =>
                v != null ? `₦${(v / 1000).toFixed(0)}k` : ""
              }
            />
            <Tooltip
              formatter={(
                value: string | number | readonly (string | number)[] | undefined,
                name: string | number | undefined,
              ): [string, string] => [
                `₦${Number(Array.isArray(value) ? value[0] : (value ?? 0)).toLocaleString()}`,
                name === "actual" ? "Actual savings" : "Grid projection",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
              }}
            />

            <Area
              type="monotone"
              dataKey="projected"
              stroke="var(--color-slate-50)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              fill="url(#projectedFade)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--color-amber-50)"
              strokeWidth={2}
              fill="url(#actualFade)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-amber-50)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
