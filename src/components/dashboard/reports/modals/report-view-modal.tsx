"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "@/lib/mocks/reports-data";
import { REPORT_ICON_MAP, REPORT_STATUS_COLORS } from "@/constants/reports";
import { cn } from "@/lib/utils";

interface ReportViewModalProps {
  report: Report | null;
  onClose: () => void;
  onShare?: (report: Report) => void;
  onDownload?: (report: Report) => void;
}

export function ReportViewModal({ report, onClose, onShare, onDownload }: ReportViewModalProps) {
  if (!report) return null;

  const Icon = REPORT_ICON_MAP[report.iconType] ?? REPORT_ICON_MAP.solar;

  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-card rounded-lg p-6 gap-6 flex flex-col w-74.25 sm:w-113 sm:max-w-113 max-w-74.25"
      >
        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex shrink-0 items-center justify-center rounded-full bg-accent"
                style={{ width: 40, height: 40 }}
              >
                <Icon className="size-4 text-primary" />
              </div>
              <div className="flex flex-col gap-2 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="text-foreground truncate text-sm sm:text-base font-semibold">
                    {report.title}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold shrink-0"
                    style={{
                      backgroundColor: (REPORT_STATUS_COLORS[report.status?.toUpperCase()] ?? REPORT_STATUS_COLORS.READY).bg,
                      color: (REPORT_STATUS_COLORS[report.status?.toUpperCase()] ?? REPORT_STATUS_COLORS.READY).text,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: (REPORT_STATUS_COLORS[report.status?.toUpperCase()] ?? REPORT_STATUS_COLORS.READY).text,
                      }}
                    />
                    {report.status?.charAt(0).toUpperCase() + report.status?.slice(1).toLowerCase()}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-xs sm:text-sm">
                  {report.subtitle}
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

          {/* Stat tiles — restored design */}
          <div className="flex items-stretch gap-[13.5px] sm:gap-4">
            <div
              className="flex flex-1 flex-col rounded-sm border bg-muted"
              style={{ borderColor: "var(--color-border-disabled)", padding: 12 }}
            >
              <p
                className="font-medium text-muted-foreground"
                style={{ fontSize: 10, lineHeight: "15px" }}
              >
                <span className="sm:hidden">Battery Efficiency</span>
                <span className="hidden sm:inline" style={{ fontSize: 12, lineHeight: "100%" }}>
                  Battery Efficiency
                </span>
              </p>
              <p
                className="font-semibold text-foreground mt-auto"
                style={{ fontSize: 14, lineHeight: "21px" }}
              >
                <span className="sm:hidden">98%</span>
                <span className="hidden sm:inline" style={{ fontSize: 16, lineHeight: "100%" }}>
                  98%
                </span>
              </p>
            </div>

            <div
              className="flex flex-1 flex-col rounded-sm border bg-muted"
              style={{ borderColor: "var(--color-border-disabled)", padding: 12 }}
            >
              <p
                className="font-medium text-muted-foreground"
                style={{ fontSize: 10, lineHeight: "15px" }}
              >
                <span className="sm:hidden">Solar Output</span>
                <span className="hidden sm:inline" style={{ fontSize: 12, lineHeight: "100%" }}>
                  Solar Output
                </span>
              </p>
              <p
                className="font-semibold text-foreground mt-auto"
                style={{ fontSize: 14, lineHeight: "21px" }}
              >
                <span className="sm:hidden">{report.keyMetrics.value}</span>
                <span className="hidden sm:inline" style={{ fontSize: 16, lineHeight: "100%" }}>
                  {report.keyMetrics.value}
                </span>
              </p>
            </div>

            <div
              className="flex flex-1 flex-col rounded-sm border bg-muted"
              style={{ borderColor: "var(--color-border-disabled)", padding: 12 }}
            >
              <p
                className="font-medium text-muted-foreground"
                style={{ fontSize: 10, lineHeight: "15px" }}
              >
                <span className="sm:hidden">Alerts</span>
                <span className="hidden sm:inline" style={{ fontSize: 12, lineHeight: "100%" }}>
                  Alerts
                </span>
              </p>
              <p
                className="font-semibold text-foreground mt-auto"
                style={{ fontSize: 14, lineHeight: "21px" }}
              >
                <span className="sm:hidden">4</span>
                <span className="hidden sm:inline" style={{ fontSize: 16, lineHeight: "100%" }}>
                  4
                </span>
              </p>
            </div>
          </div>

          {/* Key Insights section */}
          <div className="flex flex-col gap-2 mt-4">
            <h3
              className="font-semibold text-secondary"
              style={{ fontSize: 14, lineHeight: "21px" }}
            >
              Key Insights
            </h3>

            {/* Insight cards */}
            <div className="flex flex-col gap-2">
              <div
                className="flex items-start gap-2 rounded-lg bg-muted"
                style={{ padding: 16 }}
              >
                <div className="shrink-0 mt-0.75">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="9" cy="9" r="8" stroke="var(--primary)" strokeWidth="1.5" />
                    <line x1="9" y1="5" x2="9" y2="10" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="9" cy="13" r="0.75" fill="var(--primary)" />
                  </svg>
                </div>

                <p
                  className="font-normal text-(--color-surface-100)"
                  style={{ fontSize: 14, lineHeight: "21px" }}
                >
                  Unit 2 inverter logged 3 throttle events between 21-22 April. Physical inspection pending.
                </p>
              </div>

              <div
                className="flex items-start gap-2 rounded-lg bg-muted"
                style={{ padding: 16 }}
              >
                <div className="shrink-0 mt-0.75">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="9" cy="9" r="8" stroke="var(--color-success-alt)" strokeWidth="1.5" />
                    <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="var(--color-success-alt)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <p
                  className="font-normal text-(--color-surface-100)"
                  style={{ fontSize: 14, lineHeight: "21px" }}
                >
                  April monthly yield of 703kWh is 4% above the modelled forecast.
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex justify-between"
            style={{ marginTop: 24 }}
          >
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onShare?.(report);
              }}
              className="gap-1.5 text-sm font-medium cursor-pointer
                w-29.5 sm:w-48 h-10
                rounded-(--radius)
                border
                px-(--spacing-4,16px) py-(--spacing-2,8px)
                hover:opacity-80 transition-opacity"
              style={{ color: "var(--foreground)", backgroundColor: "var(--color-surface-40)", borderColor: "var(--color-border-disabled)" }}
            >
              Share Report
            </Button>

            <Button
              onClick={() => {
                onDownload?.(report);
                onClose();
              }}
              disabled={report.status?.toUpperCase() !== "READY"}
              className={cn(
                "gap-1.5 text-sm font-medium cursor-pointer w-29.5 h-10 sm:w-48 rounded-(--radius) px-(--spacing-4,16px) py-(--spacing-2,8px) hover:opacity-80 transition-opacity",
                report.status?.toUpperCase() !== "READY" && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
              style={{ backgroundColor: "var(--secondary)", color: "var(--color-surface-white)" }}
            >
              Download PDF
            </Button>
          </div>
        </div>

        <DialogTitle className="sr-only">{report.title}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
