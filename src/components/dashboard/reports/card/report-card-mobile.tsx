"use client";

import { CheckCircle, MoreVertical, Trash2, Ban } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { Report } from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { REPORT_ICON_MAP } from "@/constants/reports";
import { ReportStatusBadge } from "@/components/dashboard/reports/table/report-status-badge";

interface ReportCardMobileProps {
  report: Report;
  onView: () => void;
  downloadingId: string | null;
  completedId: string | null;
  onDownload: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function ReportCardMobile({
  report,
  onView,
  downloadingId,
  completedId,
  onDownload,
  onCancel,
  onDelete,
}: ReportCardMobileProps) {
  const Icon = REPORT_ICON_MAP[report.iconType];
  const isPending = report.status?.toUpperCase() === "PENDING";
  const isReady = report.status?.toUpperCase() === "READY";
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(report.id);
  const canDelete = isUuid;
  const showMoreOptions = canDelete || isPending;

  return (
    <div className="bg-card border-border flex w-full flex-col rounded-[8px] border p-6 sm:hidden relative">
      {showMoreOptions && (
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg p-0 text-foreground hover:bg-muted"
                aria-label="More options"
              >
                <MoreVertical className="size-4 text-foreground" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={4}
                align="end"
                className="bg-card border-border z-50 min-w-40 overflow-hidden rounded-xl border py-1 shadow-lg"
              >
                {isPending && (
                  <DropdownMenu.Item
                    onSelect={onCancel}
                    className="cursor-pointer px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 outline-none transition-colors flex items-center gap-1.5"
                  >
                    <Ban className="size-3.5" />
                    Cancel Report
                  </DropdownMenu.Item>
                )}
                {canDelete && (
                  <DropdownMenu.Item
                    onSelect={onDelete}
                    className="cursor-pointer px-4 py-2.5 text-sm text-destructive hover:bg-red-50 outline-none transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    Delete Report
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <ReportStatusBadge status={report.status} />
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-(--color-border-disabled) flex size-10 shrink-0 items-center justify-center rounded-full">
            <Icon className="text-foreground size-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-foreground truncate text-sm font-semibold">{report.title}</p>
            <p className="text-muted-foreground truncate text-xs">{report.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={onView}
            className="bg-secondary text-primary-foreground hover:bg-secondary/80 flex h-10 flex-1 items-center justify-center rounded-lg p-[8px_16px] text-xs font-medium"
          >
            View
          </Button>
          <Button
            onClick={onDownload}
            variant="outline"
            className={cn(
              "border-border text-foreground flex h-10 flex-1 items-center justify-center rounded-lg border bg-transparent p-[8px_16px] text-xs font-medium",
              !isReady && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
            disabled={downloadingId === report.id || completedId === report.id || !isReady}
          >
            {downloadingId === report.id ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </span>
            ) : completedId === report.id ? (
              <span className="flex items-center gap-1.5 text-(--color-success-alt)">
                <CheckCircle className="size-3.5 text-(--color-success-alt)" />
                Ready
              </span>
            ) : (
              "Download"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
