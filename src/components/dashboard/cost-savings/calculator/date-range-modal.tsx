"use client";

import { useRef, useEffect, useCallback } from "react";
import { CalendarDays, AlertCircle, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateRangeModalProps {
  open: boolean;
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function DateRangeModal({
  open,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onConfirm,
  onClose,
}: DateRangeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const stableOnClose = useCallback(() => onClose(), [onClose]);

  const FOCUSABLE =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  useEffect(() => {
    if (!open) return;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    if (first) {
      first.focus();
    } else {
      dialogRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") stableOnClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, stableOnClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) stableOnClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
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
            onClick={stableOnClose}
            aria-label="Close modal"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

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
                className="flex-1 bg-transparent cursor-pointer text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
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
                className="flex-1 bg-transparent cursor-pointer text-sm text-foreground focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {startDate && endDate && startDate > endDate && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> End date must be
              after start date
            </p>
          )}
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={stableOnClose}
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
