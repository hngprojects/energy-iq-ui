"use client";

import React, { useState, useRef } from "react";
import { X, CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  PERIOD_OPTIONS,
  REPORT_TYPE_OPTIONS,
  type ReportPeriodId,
  type ReportTypeId,
} from "@/constants/reports";
import { cn } from "@/lib/utils";

export type GenerateReportDetails = {
  title: string;
  period: ReportPeriodId;
  type: ReportTypeId;
  backendType: "GENERAL" | "SOLAR" | "ALERT" | "COSTS_AND_SAVINGS";
  referenceDate?: string;
  startDate?: string;
  endDate?: string;
  recurring: boolean;
};

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (details: GenerateReportDetails) => void;
}

function DateField({
  label,
  value,
  onChange,
  inputRef,
  helperText,
  errorText,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  helperText?: string;
  errorText?: string;
  className?: string;
}) {
  const handleClick = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <span className="font-semibold text-xs text-(--color-slate-80) leading-none">
        {label}
      </span>
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center justify-between border border-(--color-slate-60) rounded-lg px-4 h-13 bg-transparent hover:border-foreground transition-colors w-full cursor-pointer text-sm font-normal text-(--color-surface-100)"
      >
        <span>{value || "Select date"}</span>
        <CalendarPlus
          className="size-5 text-(--color-slate-70) group-hover:text-foreground transition-colors"
          strokeWidth={1.5}
        />
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute w-px h-px opacity-0 pointer-events-none -z-10"
      />
      {helperText && !errorText && (
        <p className="text-xs text-muted-foreground leading-normal">
          {helperText}
        </p>
      )}
      {errorText && (
        <p className="text-xs text-destructive leading-normal">{errorText}</p>
      )}
    </div>
  );
}

export function GenerateReportModal({
  open,
  onClose,
  onGenerate,
}: GenerateReportModalProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriodId>("weekly");
  const [selectedType, setSelectedType] = useState<ReportTypeId>("general");
  const [referenceDate, setReferenceDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [recurring, setRecurring] = useState(false);

  const referenceDateInputRef = useRef<HTMLInputElement>(null);
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const typeOption = REPORT_TYPE_OPTIONS.find((k) => k.id === selectedType);
  const backendType = typeOption?.backendValue ?? "GENERAL";

  const isPeriodMode =
    selectedPeriod === "weekly" || selectedPeriod === "monthly";
  const isCustomMode = selectedPeriod === "custom";
  const showRecurring = selectedPeriod !== "custom";

  const isDateRangeValid =
    !isCustomMode || (!!startDate && !!endDate && startDate <= endDate);

  const isFormValid = isPeriodMode || isDateRangeValid;

  const handleGeneratePDF = () => {
    if (!isFormValid) return;

    const details: GenerateReportDetails = {
      title:
        reportTitle ||
        selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1),
      period: selectedPeriod,
      type: selectedType,
      backendType,
      recurring: showRecurring ? recurring : false,
    };

    if (isPeriodMode) {
      details.referenceDate =
        referenceDate ||
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0];
    } else {
      details.startDate = startDate;
      details.endDate = endDate;
    }

    onGenerate(details);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 bg-card p-4 sm:p-6 pb-6 sm:pb-8 flex flex-col w-74.25 max-h-[96vh] sm:w-xl sm:max-h-[92vh] max-w-none sm:max-w-none rounded-[8px] border-none shadow-lg focus:outline-none gap-6 overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col w-full sm:w-132">
          <div className="flex items-center justify-between w-full h-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center bg-(--color-border-disabled)">
                <Calendar
                  className="w-3.75 h-3.75 text-(--color-secondary)"
                  strokeWidth={2}
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <p className="font-semibold text-base leading-none truncate text-(--color-surface-100)">
                  Generate Report
                </p>
                <p className="hidden sm:block font-normal text-sm leading-none mt-1.5 truncate text-muted-foreground capitalize">
                  {selectedPeriod}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              aria-label="Close modal"
              className="size-8 p-0 shrink-0 flex items-center justify-center hover:bg-transparent hover:opacity-75 transition-opacity"
            >
              <X className="size-6 text-(--color-surface-100)" />
            </Button>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {/* Section 1 — Report Period */}
            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-sm leading-none text-(--color-surface-100)">
                Report Period
              </span>
              <div className="grid grid-cols-3 gap-2 sm:gap-[16.5px] w-full">
                {PERIOD_OPTIONS.map((opt) => {
                  const isSelected = selectedPeriod === opt.id;
                  const IconComp = opt.icon;
                  return (
                    <Button
                      key={opt.id}
                      variant="ghost"
                      onClick={() => {
                        setSelectedPeriod(opt.id);
                        setRecurring(false);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 w-19.5 sm:w-41.25 h-23.25 rounded-lg border p-3 cursor-pointer transition-all",
                        isSelected
                          ? "bg-(--color-amber-20) border-(--color-amber-30)"
                          : "bg-(--color-slate-10) border-(--color-border-disabled)",
                      )}
                    >
                      <IconComp
                        className={cn(
                          "size-5 transition-colors",
                          isSelected
                            ? "text-(--color-amber-60)"
                            : "text-(--color-slate-70)",
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] sm:text-xs font-semibold leading-none text-(--color-surface-100)">
                        {opt.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section 2 — Report Type */}
            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-sm leading-none text-(--color-surface-100)">
                Report Type
              </span>
              <p className="text-xs text-muted-foreground leading-none">
                You can choose a different report type from the default.
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-[16.5px] w-full mt-2">
                {REPORT_TYPE_OPTIONS.map((opt) => {
                  const isSelected = selectedType === opt.id;
                  const IconComp = opt.icon;
                  return (
                    <Button
                      key={opt.id}
                      variant="ghost"
                      onClick={() => setSelectedType(opt.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 w-14.5 sm:w-30.75 h-23.25 rounded-lg border p-3 cursor-pointer transition-all",
                        isSelected
                          ? "bg-(--color-amber-20) border-(--color-amber-30)"
                          : "bg-(--color-slate-10) border-(--color-border-disabled)",
                      )}
                    >
                      <IconComp
                        className={cn(
                          "size-5 transition-colors",
                          isSelected
                            ? "text-(--color-amber-60)"
                            : "text-(--color-slate-70)",
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] sm:text-xs font-semibold leading-none text-(--color-surface-100)">
                        {opt.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Section 3 — Dates + Recurring */}
            {isPeriodMode ? (
              <div className="flex flex-col gap-4 w-full">
                <DateField
                  label="Reference Date"
                  value={referenceDate}
                  onChange={setReferenceDate}
                  inputRef={referenceDateInputRef}
                  helperText={
                    !referenceDate
                      ? "Defaults to today if left unselected."
                      : undefined
                  }
                />

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Run this report automatically"
                    />
                    <div
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 cursor-pointer peer-focus-visible:outline-2",
                        recurring
                          ? "bg-(--color-secondary)"
                          : "bg-(--color-slate-30)",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                          recurring ? "translate-x-5.5" : "translate-x-1",
                        )}
                      />
                    </div>
                    <span className="text-sm font-medium text-(--color-surface-100)">
                      Run this report automatically
                    </span>
                  </label>

                  {recurring && (
                    <p className="text-xs text-muted-foreground leading-normal">
                      {selectedPeriod === "weekly"
                        ? "Runs every Monday at midnight, generating a report for the past week."
                        : "Runs at the end of the month at midnight, generating a report for the month."}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <DateField
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    inputRef={startDateInputRef}
                    className="sm:w-[256px]"
                  />
                  <DateField
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    inputRef={endDateInputRef}
                    className="sm:w-[256px]"
                  />
                </div>

                {isCustomMode &&
                  !isDateRangeValid &&
                  (startDate || endDate) && (
                    <p className="text-xs text-destructive mt-2">
                      {!startDate || !endDate
                        ? "Please select both a start and end date."
                        : "End date must be after the start date."}
                    </p>
                  )}
              </div>
            )}

            {/* Report Title */}
            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-xs text-(--color-slate-80) leading-none">
                Report Title{" "}
                <span className="font-normal text-(--color-slate-80)">
                  (Optional)
                </span>
              </span>
              <Input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter your preferred title"
                className="h-12.25 rounded-lg border border-(--color-slate-60) px-4 py-3 text-sm focus-visible:border-border-active bg-transparent placeholder:text-muted-foreground w-full sm:w-132"
              />
            </div>

            {/* Action Button */}
            <div className="flex w-full shrink-0 mt-2 mb-2">
              <Button
                onClick={handleGeneratePDF}
                disabled={!isFormValid}
                className="w-full h-10 rounded-lg text-sm font-semibold bg-secondary text-primary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sm:hidden">Generate</span>
                <span className="hidden sm:inline">Generate Report</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogTitle className="sr-only">Generate Report</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
