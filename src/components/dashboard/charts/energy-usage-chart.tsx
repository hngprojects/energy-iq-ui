"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
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
type Period = "Hourly" | "Daily" | "Weekly" | "Monthly";

const PERIODS: Period[] = ["Hourly", "Daily", "Weekly", "Monthly"];

const PERIOD_DATA: Record<Period, Row[]> = {
  Hourly: [
    { day: "6am", generated: 1.2, used: 0.8 },
    { day: "8am", generated: 2.4, used: 1.6 },
    { day: "10am", generated: 3.8, used: 2.5 },
    { day: "12pm", generated: 4.2, used: 2.8 },
    { day: "2pm", generated: 3.9, used: 3.1 },
    { day: "4pm", generated: 3.1, used: 2.9 },
    { day: "6pm", generated: 1.8, used: 2.4 },
    { day: "8pm", generated: 0.4, used: 1.9 },
    { day: "10pm", generated: 0.1, used: 1.2 },
  ],
  Daily: [
    { day: "Mon", generated: 22, used: 19 },
    { day: "Tue", generated: 24, used: 20 },
    { day: "Wed", generated: 23, used: 21 },
    { day: "Thurs", generated: 31, used: 25 },
    { day: "Fri", generated: 30, used: 24 },
    { day: "Sat", generated: 27, used: 22 },
    { day: "Sun", generated: 24, used: 20 },
  ],
  Weekly: [
    { day: "Wk 1", generated: 148, used: 130 },
    { day: "Wk 2", generated: 162, used: 141 },
    { day: "Wk 3", generated: 175, used: 155 },
    { day: "Wk 4", generated: 168, used: 149 },
  ],
  Monthly: [
    { day: "Jan", generated: 580, used: 510 },
    { day: "Feb", generated: 620, used: 540 },
    { day: "Mar", generated: 710, used: 600 },
    { day: "Apr", generated: 780, used: 650 },
    { day: "May", generated: 850, used: 700 },
    { day: "Jun", generated: 820, used: 680 },
  ],
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
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
  const [period, setPeriod] = useState<Period>("Daily");
  const chartData = period === "Daily" ? data : PERIOD_DATA[period];

  return (
    <div className="border-border bg-card rounded-2xl border p-5 lg:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Energy usage</h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            How much your panels generated vs how much power you used
          </p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="border-border hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors"
            >
              {period} <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              align="end"
              className="bg-card border-border z-50 min-w-32 overflow-hidden rounded-xl border py-1 shadow-lg"
            >
              {PERIODS.map((p) => (
                <DropdownMenu.Item
                  key={p}
                  onSelect={() => setPeriod(p)}
                  className={cn(
                    "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                    period === p
                      ? "bg-muted text-foreground font-semibold"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {p}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
