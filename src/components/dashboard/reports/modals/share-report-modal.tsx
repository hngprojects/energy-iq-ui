"use client";

import React, { useState } from "react";
import { X, Calendar, Mail, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "@/lib/mocks/reports-data";
import { reportsService } from "@/services/reports-service";
import { REPORT_STATUS_COLORS } from "@/constants/reports";

import { cn } from "@/lib/utils";

interface ShareReportModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

export function ShareReportModal({ report, open, onClose }: ShareReportModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!report) return null;

  const getReportMonthYear = (dateStr: string) => {
    const parts = dateStr.split(" ");
    if (parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`;
    }
    return dateStr;
  };

  const formattedMonthYear = getReportMonthYear(report.date || "April 2026");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareEmail = async () => {
    if (["1", "2", "3", "4", "5", "6", "7"].includes(report.id)) {
      window.location.href = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(`Here is the report: ${report.title} (${report.subtitle})`)}`;
      return;
    }

    setIsSendingEmail(true);
    const toastId = toast.loading("Sending email report...");
    try {
      await reportsService.emailReport(report.id);
      toast.success("Report email sent successfully!", { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send email report";
      console.error(err);
      toast.error(message, { id: toastId });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Here is the report: ${report.title} (${report.subtitle})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const isReady = report.status?.toUpperCase() === "READY";

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-card p-6 flex flex-col w-74.25 h-86.5 sm:w-113 sm:h-80.5 max-w-none sm:max-w-none rounded-[8px] border-none shadow-lg focus:outline-none"
      >
        <div className="flex flex-col justify-between w-62.25 h-74.5 sm:w-101 sm:h-68.5">
          <div className="flex items-center justify-between w-full h-11.75 sm:h-10.25">
            <div className="flex items-center min-w-0">
              <div className="w-10 h-10 rounded-full bg-(--color-border-disabled) flex shrink-0 items-center justify-center border-[1.5px] border-secondary">
                <Share2 className="size-4 text-secondary" strokeWidth={1.5} />
              </div>

              <div className="ml-3 flex flex-col justify-center min-w-0 h-11.75 sm:h-10.25 gap-2">
                <p 
                  className="font-semibold text-(--color-surface-100) truncate text-sm sm:text-base leading-5.25 sm:leading-none w-22 sm:w-54.5"
                >
                  Share Report
                </p>
                <p 
                  className="font-normal text-muted-foreground truncate text-xs sm:text-sm leading-4.5 sm:leading-none w-14.5 sm:w-55.25"
                >
                  {formattedMonthYear}
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

          <div className="flex items-center bg-(--color-slate-10) rounded-(--radius) w-62.25 h-23.5 sm:w-101 sm:h-19 p-4 gap-2 sm:mt-6">
            <div className="flex shrink-0 items-center justify-center">
              <Calendar className="w-4.5 h-4.25 text-primary" strokeWidth={2} />
            </div>

            <div className="ml-2 flex flex-col justify-center gap-2 w-30.25 sm:w-67 min-w-0">
              <p className="font-semibold text-sm text-(--color-surface-100) truncate leading-none">
                {report.title}
              </p>
              <p className="font-normal text-sm text-(--color-slate-80) truncate leading-none">
                PDF {report.subtitle}
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center ml-auto">
              <span
                className="inline-flex items-center gap-1.5 rounded-[16px] px-2 py-0.5 text-[10px] font-semibold"
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
          </div>

          <div className="flex gap-4 w-62.25 h-19.25 sm:w-101">
            <Button
              variant="ghost"
              onClick={handleShareEmail}
              disabled={isSendingEmail || !isReady}
              className={cn(
                "w-[116.5px] sm:w-48.5 h-19.25 flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-foreground",
                !isReady && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {isSendingEmail ? (
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              ) : (
                <Mail className="w-8 h-8 text-(--color-surface-100)" />
              )}

              <span className="font-medium text-base text-(--color-surface-100) leading-none">
                {isSendingEmail ? "Sending..." : "Email"}
              </span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleShareWhatsApp}
              className="w-[116.5px] sm:w-48.5 h-19.25 flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-(--color-battery-full)"
            >
              <svg viewBox="0 0 24 24" fill="var(--color-battery-full)" className="w-8 h-8">
                <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.477 1.332 4.992L2 22l5.131-1.347c1.455.795 3.097 1.213 4.87 1.213 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm0 18.293c-1.579 0-3.123-.424-4.475-1.226l-.321-.191-3.323.872.887-3.238-.21-.334c-.878-1.401-1.342-3.018-1.342-4.697 0-4.707 3.829-8.536 8.536-8.536 4.707 0 8.536 3.829 8.536 8.536 0 4.707-3.83 8.536-8.536 8.536z" />
              </svg>

              <span className="font-medium text-base text-(--color-surface-100) leading-none">
                WhatsApp
              </span>
            </Button>
          </div>

          <div className="flex justify-start w-24 h-6 mt-4">
            <Button
              variant="ghost"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity p-0 h-6 bg-transparent hover:bg-transparent hover:text-foreground"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Copy className="size-4 text-(--color-surface-100)" />
              </div>
              <span className="font-normal text-sm text-(--color-surface-100) w-16 h-4.5 ml-2 leading-none flex items-center">
                Copy Link
              </span>
            </Button>
          </div>
        </div>

        <DialogTitle className="sr-only">Share {report.title}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
