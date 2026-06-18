"use client";

import React from "react";
import { X, CheckCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportsNotificationToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function ReportsNotificationToast({
  open,
  onClose,
  title,
  description,
  actionText,
  onAction,
}: ReportsNotificationToastProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed z-70 rounded-[8px] border border-(--color-border-disabled) bg-(--color-slate-10) p-6 shadow-lg flex flex-col justify-between w-74.25 h-34.5 sm:w-90 bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:top-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="relative w-full h-full flex flex-col justify-between">
        <div className="flex items-start gap-3 w-full">
          <div className="w-9 h-9 rounded-full bg-(--color-battery-full) border-[1.5px] border-(--color-surface-40) flex shrink-0 items-center justify-center shadow-sm">
            <CheckCircle className="size-5 text-(--color-slate-10)" strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-2 w-45 sm:w-60 min-w-0">
            <h3
              className="font-semibold text-[20px] text-foreground leading-none"
            >
              {title}
            </h3>
            <p className="font-normal text-[14px] text-foreground opacity-90 leading-none truncate">
              {description}
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-0 right-0 w-6 h-6 p-0 hover:bg-transparent hover:text-foreground shrink-0"
            aria-label="Close notification"
          >
            <X className="text-(--color-surface-100) size-4" />
          </Button>
        </div>

        {actionText && onAction && (
          <div className="flex justify-end w-full">
            <Button
              variant="ghost"
              onClick={onAction}
              className="inline-flex items-center gap-1 text-[14px] font-medium text-secondary hover:underline p-0 h-4.5 bg-transparent hover:bg-transparent hover:text-secondary"
            >
              {actionText}
              <ArrowUpRight className="size-4 shrink-0" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
