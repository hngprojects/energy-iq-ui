"use client";

import { CheckCircle, Download, MoreVertical, Trash2, Ban } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { Report } from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { REPORT_ICON_MAP } from "@/constants/reports";
import { ReportStatusBadge } from "@/components/dashboard/reports/table/report-status-badge";

export function SkeletonRow() {
  return (
    <tr className="border-border border-b last:border-0">
      <td className="w-75 border-b p-[12px_24px]">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
          <div className="space-y-1.5">
            <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
            <div className="bg-muted h-3 w-28 animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="w-34.5 border-b p-[12px_24px]">
        <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
      </td>
      <td className="w-34.5 border-b p-[12px_24px]">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="w-34.5 border-b p-[12px_24px]">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="w-34.5 border-b p-[12px_24px]">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="w-34.5 border-b p-[12px_24px]">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="w-40.5 border-b p-[12px_24px]">
        <div className="bg-muted ml-auto h-8 w-20 animate-pulse rounded-lg" />
      </td>
    </tr>
  );
}

interface ReportTableDesktopProps {
  reports: Report[];
  isLoading: boolean;
  downloadingId: string | null;
  completedId: string | null;
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReportTableDesktop({
  reports,
  isLoading,
  downloadingId,
  completedId,
  onView,
  onDownload,
  onCancel,
  onDelete,
}: ReportTableDesktopProps) {
  return (
    <div className="hidden overflow-x-auto no-scrollbar sm:block">
      <table className="w-full min-w-6xl">
        <thead>
          <tr className="border-border border-b bg-muted/30">
            <th style={{ width: 300 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Name</th>
            <th style={{ width: 138 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Type</th>
            <th style={{ width: 138 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Status</th>
            <th style={{ width: 138 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Key Metrics</th>
            <th style={{ width: 138 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Recipients</th>
            <th style={{ width: 138 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Date</th>
            <th style={{ width: 162 }} className="text-muted-foreground h-11 px-6 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : reports.map((report) => {
                const Icon = REPORT_ICON_MAP[report.iconType];
                const isReady = report.status?.toUpperCase() === "READY";
                const isPending = report.status?.toUpperCase() === "PENDING";
                const canDelete = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(report.id);

                return (
                  <tr
                    key={report.id}
                    className="border-border border-b last:border-0 hover:bg-muted/10 transition-colors animate-fade-in"
                  >
                    <td className="w-75 p-[12px_24px]">
                      <div className="flex items-center gap-3">
                        <div className="bg-(--color-border-disabled) flex size-10 shrink-0 items-center justify-center rounded-full">
                          <Icon className="text-foreground size-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-foreground truncate text-base font-semibold">{report.title}</p>
                          <p className="text-muted-foreground mt-0.5 truncate text-sm">{report.subtitle}</p>
                        </div>
                      </div>
                    </td>

                    <td className="w-34.5 p-[12px_24px]">
                      <span className="font-sans text-sm font-normal leading-none tracking-normal" style={{ color: "var(--color-slate-80)" }}>
                        {report.type}
                      </span>
                    </td>

                    <td className="w-34.5 p-[12px_24px]">
                      <ReportStatusBadge status={report.status} />
                    </td>

                    <td className="w-34.5 p-[12px_24px]">
                      <div className="inline-flex flex-col items-end">
                        <p className="font-sans text-sm font-semibold leading-none tracking-normal whitespace-nowrap" style={{ color: "var(--color-amber-60)" }}>
                          {report.keyMetrics.value}
                        </p>
                        <p className="font-sans mt-1 text-xs font-normal leading-none tracking-normal whitespace-nowrap" style={{ color: "var(--color-slate-70)" }}>
                          {report.keyMetrics.label}
                        </p>
                      </div>
                    </td>

                    <td className="w-34.5 p-[12px_24px]">
                      <span className="text-foreground text-sm hover:underline cursor-pointer">{report.recipients}</span>
                    </td>

                    <td className="w-34.5 p-[12px_24px]">
                      <span className="text-muted-foreground text-sm">{report.date}</span>
                    </td>

                    <td className="w-40.5 p-[12px_24px] text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => onView(report)}
                          className="bg-secondary text-primary-foreground hover:bg-secondary/80 w-16.5 h-10 rounded-lg gap-1.5 py-2 px-4 text-sm font-medium transition-colors"
                        >
                          View
                        </Button>

                        {downloadingId === report.id ? (
                          <Button
                            disabled
                            variant="ghost"
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-border-disabled) cursor-not-allowed p-0 hover:bg-(--color-border-disabled)"
                            aria-label="Downloading report"
                          >
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                          </Button>
                        ) : completedId === report.id ? (
                          <Button
                            disabled
                            variant="ghost"
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-border-disabled) cursor-default p-0 hover:bg-(--color-border-disabled)"
                            aria-label="Download complete"
                          >
                            <CheckCircle className="size-4 text-(--color-success-alt)" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => onDownload(report)}
                            disabled={!isReady}
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-border-disabled) transition-colors hover:bg-(--color-slate-30) p-0 text-foreground hover:text-foreground",
                              !isReady && "opacity-50 cursor-not-allowed hover:bg-transparent"
                            )}
                            aria-label="Download report"
                          >
                            <Download className="size-4 text-foreground" />
                          </Button>
                        )}

                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-border-disabled) transition-colors hover:bg-(--color-slate-30) p-0 text-foreground hover:text-foreground"
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
                                  onSelect={() => onCancel(report.id)}
                                  className="cursor-pointer px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 outline-none transition-colors flex items-center gap-1.5"
                                >
                                  <Ban className="size-3.5" />
                                  Cancel Report
                                </DropdownMenu.Item>
                              )}
                              {canDelete && (
                                <DropdownMenu.Item
                                  onSelect={() => onDelete(report.id)}
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
                    </td>
                  </tr>
                );
              })}

          {!isLoading && reports.length === 0 && (
            <tr>
              <td colSpan={7} className="text-muted-foreground py-20 text-center text-sm">
                No reports match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
