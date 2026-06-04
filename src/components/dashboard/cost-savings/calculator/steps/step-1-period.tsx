"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDays,
  Check,
  AlertCircle,
  ArrowRight,
  X,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────────────────────

type PeriodId = "this-week" | "this-month" | "last-month" | "custom";

interface Period {
  id: PeriodId;
  label: string;
  dateRange: string;
}

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

// ── Date range modal ──────────────────────────────────────────────────────────

function DateRangeModal({
  open,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onConfirm,
  onClose,
}: {
  open: boolean;
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Bug 5 fix: onClose is now stable (useCallback in parent), so this effect
  // won't tear down and re-register the listener on every parent render.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Bug 6 fix: trap focus inside the dialog when the user tabs through it.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  const canConfirm = startDate && endDate && startDate <= endDate;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select custom date range"
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-light">
              <CalendarDays className="h-4 w-4 text-amber-60" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">
                Custom date range
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Select a start and end date
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="modal-start-date"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              From
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                id="modal-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => onStartChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
              <ArrowDown className="h-3 w-3 text-muted-foreground" />
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="modal-end-date"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              To
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                id="modal-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => onEndChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {startDate && endDate && startDate > endDate && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              End date must be after start date
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-40"
          >
            Apply range
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Period card ───────────────────────────────────────────────────────────────

function PeriodCard({
  period,
  selected,
  dateLabel,
  onSelect,
}: {
  period: Period;
  selected: boolean;
  dateLabel?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-10 cursor-pointer rounded-xl border-2 bg-card p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:-translate-y-1",
        selected
          ? "border-primary"
          : "border-border hover:border-muted-foreground/40",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
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
