import { useMemo } from "react";
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

interface CumulativeSavingsChartProps {
  chart: {
    month: string;
    savingsNgn: number;
  }[];
}

export function CumulativeSavingsChart({ chart }: CumulativeSavingsChartProps) {
  const formattedData = useMemo(() => {
    const sortedRaw = [...chart].sort((a, b) => a.month.localeCompare(b.month));
    let runningTotal = 0;
    return sortedRaw.map((item) => {
      runningTotal += item.savingsNgn;

      let formattedMonth = item.month;
      try {
        const [year, month] = item.month.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        formattedMonth = date
          .toLocaleDateString("en-US", { month: "short", year: "2-digit" })
          .toUpperCase();
      } catch {
      }

      return {
        month: formattedMonth,
        actual: runningTotal,
      };
    });
  }, [chart]);

  const formatYAxis = (v: number) => {
    if (v >= 1_000_000) {
      return `₦${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (v >= 1_000) {
      return `₦${(v / 1_000).toFixed(0)}k`;
    }
    return `₦${v}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-[8.87px] border bg-card overflow-hidden w-full lg:flex-1 lg:max-w-183.25 p-4 sm:p-6 lg:p-[26.61px] border-border",
      )}
    >
      <h3 className="leading-normal font-medium text-[18px] lg:text-[20px] truncate text-foreground">
        Cumulative Savings Growth
      </h3>

      <p className="leading-normal font-medium text-[12px] truncate mt-2 text-muted-foreground">
        Historical performance tracked monthly
      </p>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-[11px] text-grey">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
          Actual savings
        </span>
      </div>

      <div className="relative w-full mt-[37.7px] h-55 sm:h-70 lg:h-88.75">
        <p
          className="absolute left-0 text-[11px] font-medium leading-none pointer-events-none z-10 whitespace-nowrap text-amber-30"
          style={{ top: "58px" }}
        >
          Historical performance tracker
        </p>

        {formattedData.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xs">
            No savings data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-amber-50)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-amber-50)" stopOpacity={0} />
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
                ticks={
                  formattedData.length > 0
                    ? Array.from(
                        new Set([
                          formattedData[0].month,
                          formattedData[formattedData.length - 1].month,
                        ])
                      )
                    : undefined
                }
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
                tickFormatter={formatYAxis}
              />
              <Tooltip
                formatter={(
                  value: string | number | readonly (string | number)[] | undefined,
                ): [string, string] => [
                  `₦${Number(Array.isArray(value) ? value[0] : (value ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                  "Actual savings",
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
                dataKey="actual"
                stroke="var(--color-amber-50)"
                strokeWidth={2}
                fill="url(#actualFade)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-amber-50)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
