"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  iconBg: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  iconBg,
}: StatCardProps) {
  const positive = delta === undefined || delta >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            iconBg,
          )}
        >
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {delta !== undefined && deltaLabel && (
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            positive ? "text-battery-full" : "text-destructive",
          )}
        >
          {positive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {positive ? "+" : ""}
          {deltaLabel}
        </p>
      )}
    </div>
  );
}
