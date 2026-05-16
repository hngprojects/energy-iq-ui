"use client";

import { ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Row = { day: string; generated: number; used: number };

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
  }[];
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border-border bg-card rounded-xl border px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium">{label}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5">
          <span className="bg-primary h-2 w-2 rounded-full" />
          Energy Generated
        </span>
        <span className="font-semibold">{payload[0]?.value} kWh</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-6">
        <span className="flex items-center gap-1.5">
          <span className="bg-muted-foreground h-2 w-2 rounded-full" />
          Energy Used
        </span>
        <span className="font-semibold">{payload[1]?.value} kWh</span>
      </div>
    </div>
  );
}

export function EnergyUsageChart({ data }: { data: Row[] }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Energy usage</h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            How much your panels generated vs how much power you used
          </p>
        </div>
        <button className="border-border hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors">
          Weekly <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              ticks={[0, 7, 14, 21, 28, 35]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--muted-foreground)",
                strokeDasharray: "4 4",
                opacity: 0.4,
              }}
            />
            <Line
              type="monotone"
              dataKey="generated"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "var(--primary)" }}
            />
            <Line
              type="monotone"
              dataKey="used"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
