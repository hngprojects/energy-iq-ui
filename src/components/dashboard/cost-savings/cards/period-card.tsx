"use client";

import { CalendarDays, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalculationPeriod } from "../calculator/calculator-context";

export type PeriodId = CalculationPeriod;

export interface Period {
  id: PeriodId;
  label: string;
  dateRange: string;
}

interface PeriodCardProps {
  period: Period;
  selected: boolean;
  dateLabel?: string;
  onSelect: () => void;
}

export function PeriodCard({
  period,
  selected,
  dateLabel,
  onSelect,
}: PeriodCardProps) {
  return (
    <button
      type="button"
      aria-label={`Select ${period.label}`}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-10 cursor-pointer rounded-xl border-2 bg-card p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-1",
        selected
          ? "border-primary shadow-md"
          : "border-border hover:border-muted-foreground/40 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110",
            selected ? "bg-amber-light" : "bg-muted",
          )}
        >
          <CalendarDays
            className={cn(
              "h-4.5 w-4.5",
              selected ? "text-amber-60" : "text-muted-foreground",
            )}
          />
        </span>
        {selected ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary transition-all duration-200 scale-100">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </span>
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-border bg-background transition-all duration-200 scale-100" />
        )}
      </div>
      <div className="transition-transform duration-200 group-hover:-translate-y-0.5">
        <p className="text-sm font-semibold text-foreground">{period.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {dateLabel ?? period.dateRange}
        </p>
      </div>
    </button>
  );
}
