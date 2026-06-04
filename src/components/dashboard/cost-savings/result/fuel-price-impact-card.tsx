"use client";

import { Fuel } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { FUEL_SPARKLINE_DATA } from "@/lib/mocks/cost-savings-results";


function SparklineDot(props: {
  cx?: number;
  cy?: number;
  index?: number;
  dataLength?: number;
}) {
  const { cx = 0, cy = 0, index = 0, dataLength = 0 } = props;
  if (index !== dataLength - 1) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6.31}
      fill="var(--color-amber-60)"
      stroke="var(--color-amber-60)"
      strokeWidth={1.34}
    />
  );
}


export function FuelPriceImpactCard() {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden",
        "w-full lg:flex-1",
        "px-3.75 pb-4",
      )}
      style={{ borderColor: "#D8DBE2", borderWidth: "1px" }}
    >
      {/* Icon + Title */}
      <div className="flex items-center gap-2" style={{ marginTop: "24px" }}>
        <Fuel
          className="shrink-0 size-6"
          style={{ color: "#2A2F3C" }}
          aria-hidden="true"
        />
        <h3
          className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
          style={{ color: "#141414" }}
        >
          Fuel price impact
        </h3>
      </div>

      {/* Value + Sparkline */}
      <div
        className={cn(
          "flex flex-col gap-4",
          "sm:flex-row sm:items-center sm:justify-between",
        )}
        style={{ marginTop: "24px" }}
      >
        {/* Fuel price impact */}
        <p
          className="leading-[120%] text-primary shrink-0 font-bold text-[22px] sm:text-[26px] lg:text-[28px]"
          style={{ letterSpacing: "-0.01em" }}
        >
          ₦450,000
        </p>

        {/* Sparkline area chart */}
        <div className="w-full sm:flex-1 h-25 sm:h-30 lg:h-35.75 sm:ml-6 lg:ml-12.75">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={FUEL_SPARKLINE_DATA}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Fade fill */}
                <linearGradient id="fuelFade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="var(--color-amber-light)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="var(--color-amber-light)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--color-amber-60)"
                strokeWidth={1.34}
                fill="url(#fuelFade)"
                dot={(dotProps: { cx?: number; cy?: number; index?: number }) => (
                  <SparklineDot
                    key={dotProps.index}
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    index={dotProps.index}
                    dataLength={FUEL_SPARKLINE_DATA.length}
                  />
                )}
                activeDot={{
                  r: 6.31,
                  fill: "var(--color-amber-60)",
                  stroke: "var(--color-amber-60)",
                }}
              />
              <Tooltip
                formatter={(value: string | number | (string | number)[]): [string, string] => [
                  `₦${Number(Array.isArray(value) ? value[0] : value ?? 0).toLocaleString()}`,
                  "Savings",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  fontSize: "11px",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
