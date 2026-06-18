"use client";

import React from "react";
import { X, Calendar, Mail, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Report } from "@/lib/mocks/reports-data";

interface ShareReportModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

export function ShareReportModal({ report, open, onClose }: ShareReportModalProps) {
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

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(`Here is the report: ${report.title} (${report.subtitle})`)}`;
  };

  const handleShareWhatsApp = () => {
    const text = `Here is the report: ${report.title} (${report.subtitle})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-card p-6 flex flex-col w-[297px] h-[346px] sm:w-[452px] sm:h-[322px] max-w-none sm:max-w-none rounded-[8px] border-none shadow-lg focus:outline-none"
      >
        <div className="flex flex-col justify-between w-[249px] h-[298px] sm:w-[404px] sm:h-[274px]">
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

          <div className="flex items-center bg-(--color-slate-10) rounded-(--radius) w-[249px] h-[94px] sm:w-[404px] sm:h-[76px] p-4 gap-2 sm:mt-6">
            <div className="flex shrink-0 items-center justify-center">
              <Calendar className="w-4.5 h-4.25 text-primary" strokeWidth={2} />
            </div>

            <div className="ml-2 flex flex-col justify-center gap-2 w-[121px] sm:w-[268px] min-w-0">
              <p className="font-semibold text-sm text-(--color-surface-100) truncate leading-none">
                {report.title}
              </p>
              <p className="font-normal text-sm text-(--color-slate-80) truncate leading-none">
                PDF {report.subtitle}
              </p>
            </div>

            <div className="shrink-0 flex items-center justify-center ml-auto">
              <span
                className="inline-flex items-center gap-1.5 rounded-[16px] w-16 h-5 pt-0.5 pr-2 pb-0.5 pl-2 text-[10px] font-semibold"
                style={{ backgroundColor: "var(--color-success-bg)", color: "var(--color-success-alt)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--color-success-alt)" }}
                />
                {report.status}
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-[249px] h-[77px] sm:w-[404px]">
            <Button
              variant="ghost"
              onClick={handleShareEmail}
              className="w-[116.5px] sm:w-[194px] h-[77px] flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-foreground"
            >
              <Mail className="w-8 h-8 text-(--color-surface-100)" />

              <span className="font-medium text-base text-(--color-surface-100) leading-none">
                Email
              </span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleShareWhatsApp}
              className="w-[116.5px] sm:w-[194px] h-[77px] flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-(--color-battery-full)"
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
              <span className="font-normal text-sm text-(--color-surface-100) w-16 h-[18px] ml-2 leading-none flex items-center">
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
