"use client";

import React, { useState, useRef } from "react";
import { X, CalendarPlus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { REPORT_TYPES, type ReportType } from "@/constants/reports";

interface GenerateReportModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (details: { title: string; type: string; startDate: string; endDate: string }) => void;
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "";
  const fmt = (d: string) => {
    if (!d) return "";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  if (start) return fmt(start);
  return fmt(end);
}

export function GenerateReportModal({ open, onClose, onGenerate }: GenerateReportModalProps) {
  const [selectedType, setSelectedType] = useState<ReportType>("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportTitle, setReportTitle] = useState("");

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  const handleStartDateClick = () => {
    if (startDateInputRef.current) {
      try {
        startDateInputRef.current.showPicker();
      } catch {
        startDateInputRef.current.focus();
        startDateInputRef.current.click();
      }
    }
  };

  const handleEndDateClick = () => {
    if (endDateInputRef.current) {
      try {
        endDateInputRef.current.showPicker();
      } catch {
        endDateInputRef.current.focus();
        endDateInputRef.current.click();
      }
    }
  };

  const handleGeneratePDF = () => {
    onGenerate({
      title: reportTitle || selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
      type: selectedType,
      startDate,
      endDate,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 bg-card p-6 flex flex-col w-74.25 h-177.75 max-h-[96vh] sm:w-xl sm:h-155.75 sm:max-h-[92vh] max-w-none sm:max-w-none rounded-[8px] border-none shadow-lg focus:outline-none gap-6 overflow-y-auto no-scrollbar"
      >
        <div className="flex flex-col w-full sm:w-132 min-h-165.75 sm:min-h-123.75 justify-between">

          <div className="flex items-center justify-between w-full h-10 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center"
                style={{ backgroundColor: "var(--color-border-disabled)" }}
              >
                <Calendar
                  className="w-3.75 h-3.75"
                  style={{ color: "var(--color-secondary)" }}
                  strokeWidth={2}
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <p className="font-semibold text-base leading-none truncate text-(--color-surface-100)">
                  Generate Report
                </p>
                <p className="hidden sm:block font-normal text-sm leading-none mt-1.5 truncate text-muted-foreground capitalize">
                  {selectedType}
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

          <div className="flex flex-col flex-1 gap-6 mt-4 justify-between">

            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-sm leading-none text-(--color-surface-100)">
                Report Type
              </span>
              <div className="grid grid-cols-3 gap-2 sm:gap-[16.5px] w-full">
                {REPORT_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  const IconComp = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant="ghost"
                      onClick={() => setSelectedType(type.id)}
                      className="flex flex-col items-center justify-center gap-2 w-19.5 sm:w-41.25 h-23.25 rounded-(--radius) border p-3 cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--color-amber-20)"
                          : "var(--color-slate-10)",
                        borderColor: isSelected
                          ? "var(--color-amber-30)"
                          : "var(--color-border-disabled)",
                      }}
                    >
                      <IconComp
                        className="size-5 transition-colors"
                        strokeWidth={1.5}
                        style={{
                          color: isSelected
                            ? "var(--color-amber-60)"
                            : "var(--color-slate-70)",
                        }}
                      />
                      <span className="text-[10px] sm:text-xs font-semibold leading-none text-(--color-surface-100)">
                        {type.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full sm:w-[256px]">
                <span className="font-semibold text-xs text-(--color-slate-80) leading-none">
                  Start Date
                </span>
                <div
                  onClick={handleStartDateClick}
                  className="relative flex items-center justify-between border border-[#B3B3B3] rounded-lg px-4 h-13 bg-transparent hover:border-foreground transition-colors group w-full cursor-pointer"
                >
                  <span className="text-sm font-normal text-(--color-surface-100)">
                    {startDate ? startDate : "Select date"}
                  </span>
                  <CalendarPlus className="size-5 text-(--color-slate-70) group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                  <input
                    ref={startDateInputRef}
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-[256px]">
                <span className="font-semibold text-xs text-(--color-slate-80) leading-none">
                  End Date
                </span>
                <div
                  onClick={handleEndDateClick}
                  className="relative flex items-center justify-between border border-[#B3B3B3] rounded-lg px-4 h-13 bg-transparent hover:border-foreground transition-colors group w-full cursor-pointer"
                >
                  <span className="text-sm font-normal text-(--color-surface-100)">
                    {endDate ? endDate : "Select date"}
                  </span>
                  <CalendarPlus className="size-5 text-(--color-slate-70) group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                  <input
                    ref={endDateInputRef}
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <span className="font-semibold text-xs text-(--color-slate-80) leading-none">
                Report Title{" "}
                <span className="font-normal text-(--color-slate-80)">
                  (Optional)
                </span>
              </span>
              <Input
                id="report-title"
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter your preferred title"
                className="h-12.25 rounded-lg border border-[#B3B3B3] px-4 py-3 text-sm focus-visible:border-border-active bg-transparent placeholder:text-muted-foreground w-full sm:w-132"
              />
            </div>

            <div className="flex justify-between items-center w-full gap-4 shrink-0 mt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-[116.5px] sm:w-[256px] h-10 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  borderColor: "var(--color-border-disabled)",
                  backgroundColor: "var(--color-surface-10)",
                  color: "var(--color-surface-100)",
                }}
              >
                Share Report
              </Button>
              <Button
                onClick={handleGeneratePDF}
                className="w-[116.5px] sm:w-[256px] h-10 rounded-lg text-sm font-semibold bg-secondary text-primary-foreground hover:bg-secondary/80 transition-colors"
              >
                <span className="sm:hidden">Generate</span>
                <span className="hidden sm:inline">Generate as PDF</span>
              </Button>
            </div>

          </div>
        </div>

        <DialogTitle className="sr-only">Generate Report</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export { formatDateRange };
