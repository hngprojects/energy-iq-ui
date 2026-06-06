"use client";

import { useState, useMemo, useCallback } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PeriodCard,
  type Period,
  type PeriodId,
} from "../../cards/period-card";
import { DateRangeModal } from "../date-range-modal";

// ── Types ────────────────────────────────────────────────────────────────────

interface Step1PeriodProps {
  defaultValue?: PeriodId;
  onContinue?: (data: {
    period: PeriodId;
    customStartDate?: string;
    customEndDate?: string;
  }) => void;
}

// ── Period builder ────────────────────────────────────────────────────────────

function buildPeriods(): Period[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(y, m, 1);
  const monthEnd = new Date(y, m + 1, 0);

  const lastMonthStart = new Date(y, m - 1, 1);
  const lastMonthEnd = new Date(y, m, 0);

  return [
    {
      id: "this-week",
      label: "This Week",
      dateRange: `${fmt(weekStart)} - ${fmt(weekEnd)}`,
    },
    {
      id: "this-month",
      label: "This Month",
      dateRange: `${fmt(monthStart)} - ${fmt(monthEnd)}`,
    },
    {
      id: "last-month",
      label: "Last Month",
      dateRange: `${fmt(lastMonthStart)} - ${fmt(lastMonthEnd)}`,
    },
    {
      id: "custom",
      label: "Custom Range",
      dateRange: "Pick a start and end date",
    },
  ];
}

// ── Date formatter ────────────────────────────────────────────────────────────

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ── Main component ────────────────────────────────────────────────────────────

export function Step1Period({
  defaultValue = "this-week",
  onContinue,
}: Step1PeriodProps) {
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const dayNum = today.getDate();

  const [selected, setSelected] = useState<PeriodId>(defaultValue);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingStart, setPendingStart] = useState("");
  const [pendingEnd, setPendingEnd] = useState("");

  const periods = useMemo(() => buildPeriods(), []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const openModal = () => {
    setPendingStart(startDate);
    setPendingEnd(endDate);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
    setModalOpen(false);
  };

  const handleCardSelect = (id: PeriodId) => {
    setSelected(id);
    if (id === "custom") openModal();
  };

  const customDateLabel =
    startDate && endDate
      ? `${fmtDate(startDate)} - ${fmtDate(endDate)}`
      : startDate
        ? `From ${fmtDate(startDate)}`
        : "Pick a start and end date";

  const canContinue = selected !== "custom" || (startDate && endDate);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Select Calculation Period
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the time period you want to calculate your savings for.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {periods.map((period) => (
          <PeriodCard
            key={period.id}
            period={period}
            selected={selected === period.id}
            dateLabel={period.id === "custom" ? customDateLabel : undefined}
            onSelect={() => handleCardSelect(period.id)}
          />
        ))}
      </div>

      <DateRangeModal
        open={modalOpen}
        startDate={pendingStart}
        endDate={pendingEnd}
        onStartChange={setPendingStart}
        onEndChange={setPendingEnd}
        onConfirm={handleConfirm}
        onClose={closeModal}
      />

      {/* Info banner */}
      <div className="flex items-start gap-4 rounded-xl bg-amber-bg-light px-5 py-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <AlertCircle className="h-4 w-4 text-white" />
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Why does the period matter?
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your savings are calculated based on your energy usage, fuel price,
            and tariff for the selected period
          </p>
        </div>

        <div className="shrink-0 overflow-hidden rounded-lg border border-border bg-card text-center shadow-sm w-12">
          <div className="bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {monthName}
          </div>
          <div className="px-2 py-1 text-lg font-bold text-foreground leading-none">
            {dayNum}
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!canContinue}
          onClick={() =>
            onContinue?.(
              selected === "custom"
                ? {
                    period: selected,
                    customStartDate: startDate,
                    customEndDate: endDate,
                  }
                : { period: selected },
            )
          }
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 px-8 disabled:opacity-40"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
