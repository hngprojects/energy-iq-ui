"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  BatteryFull,
  CheckCircle,
  Sun,
  ChevronDown,
  Unplug,
  FileText,
  Zap,
  Download,
  Calendar,
  Microchip,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  Report,
  ReportFilterType,
  reportsMock,
  FILTER_OPTIONS,
} from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { ReportViewModal } from "@/components/dashboard/reports/report-view-modal";
import { ShareReportModal } from "@/components/dashboard/reports/share-report-modal";

const ICON_MAP = {
  battery_low: AlertTriangle,
  power_high: Unplug,
  clock: Clock,
  battery_full: BatteryFull,
  check: CheckCircle,
  solar: Sun,
  file: FileText,
  alert: AlertTriangle,
  device: Zap,
  calendar: Calendar,
  chip: Microchip,
} as const;


function StatusText({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: "#DFFFEB", color: "#17CC4E" }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: "#17CC4E" }}
      />
      {status}
    </span>
  );
}

function ReportCard({
  report,
  onView,
}: {
  report: Report;
  onView: () => void;
}) {
  const Icon = ICON_MAP[report.iconType];
  return (
    <div className="bg-card border-border flex w-86.25 flex-col rounded-[8px] border p-6 sm:hidden">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: "#DFFFEB", color: "#17CC4E" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "#17CC4E" }}
            />
            {report.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#E8E8E8] flex size-10 shrink-0 items-center justify-center rounded-full">
            <Icon className="text-[#121212] size-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-foreground truncate text-sm font-semibold">
              {report.title}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {report.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={() => onView()}
            className="bg-secondary text-primary-foreground hover:bg-secondary/80 flex h-10 flex-1 items-center justify-center rounded-lg p-[8px_16px] text-xs font-medium"
          >
            View
          </Button>
          <Button
            onClick={() => console.log("Download", report.id)}
            variant="outline"
            className="border-border text-foreground flex h-10 flex-1 items-center justify-center rounded-lg border bg-transparent p-[8px_16px] text-xs font-medium"
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
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

function FilterDropdown({
  value,
  onChange,
}: {
  value: ReportFilterType;
  onChange: (v: ReportFilterType) => void;
}) {
  const currentLabel =
    FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "All";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <span className="text-muted-foreground">Report Type:</span>
          <span className="text-foreground hidden sm:inline">{currentLabel}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="bg-card border-border z-50 min-w-36 overflow-hidden rounded-xl border py-1 shadow-lg"
        >
          {FILTER_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => onChange(opt.value)}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                value === opt.value
                  ? "bg-muted text-foreground font-semibold"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Main component
function filterReports(reports: Report[], filter: ReportFilterType): Report[] {
  if (filter === "all") return reports;
  return reports.filter((a) => a.type === filter);
}

export function ReportsTable() {
  const [reports] = useState<Report[]>(reportsMock);
  const [filter, setFilter] = useState<ReportFilterType>("all");
  const [isRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [shareReport, setShareReport] = useState<Report | null>(null);

  const displayed = filterReports(reports, filter);

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-0 sm:bg-card sm:border-border sm:overflow-hidden sm:rounded-xl sm:border">
        {/* Toolbar */}
        <div className="flex h-auto w-86.25 items-center justify-between sm:border-border sm:h-19.75 sm:w-full sm:flex-row sm:justify-between sm:border-b sm:px-6 lg:gap-2">
          {/* Filter */}
          <FilterDropdown value={filter} onChange={setFilter} />

          {/* Action Buttons — stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:w-auto">
            <Button
              variant="outline"
              className="border-border text-foreground h-8 w-35 rounded-lg border bg-transparent p-[8px_16px] text-xs font-medium sm:h-10 sm:w-35.75 sm:text-sm"
            >
              <span className="sm:hidden">Schedule</span>
              <span className="hidden sm:inline">Schedule Report</span>
            </Button>
            <Button className="bg-secondary text-primary-foreground hover:bg-secondary/80 h-8 w-35 rounded-lg p-[8px_16px] text-xs font-medium sm:h-10 sm:w-35.75 sm:text-sm">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="flex flex-col gap-4 sm:hidden">
          {isRefreshing
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card h-51.5 w-86.25 animate-pulse rounded-[8px] border border-border"
                />
              ))
            : displayed.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => setSelectedReport(report)}
                />
              ))}
          {!isRefreshing && displayed.length === 0 && (
            <div className="text-muted-foreground py-20 text-center text-sm">
              No reports match this filter.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto no-scrollbar sm:block">
          <table className="w-full min-w-6xl">
            <thead>
              <tr className="border-border border-b bg-muted/30">
                <th
                  style={{ width: 300 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Name
                </th>
                <th
                  style={{ width: 138 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Type
                </th>
                <th
                  style={{ width: 138 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Status
                </th>
                <th
                  style={{ width: 138 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Key Metrics
                </th>
                <th
                  style={{ width: 138 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Recipients
                </th>
                <th
                  style={{ width: 138 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Date
                </th>
                <th
                  style={{ width: 162 }}
                  className="text-muted-foreground h-11 px-6 text-left text-sm font-medium"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isRefreshing
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : displayed.map((report) => {
                    const Icon = ICON_MAP[report.iconType];
                    return (
                      <tr
                        key={report.id}
                        className="border-border border-b last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="w-75 p-[12px_24px]">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#E8E8E8] flex size-10 shrink-0 items-center justify-center rounded-full">
                              <Icon className="text-[#121212] size-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-foreground truncate text-base font-semibold">
                                {report.title}
                              </p>
                              <p className="text-muted-foreground mt-0.5 truncate text-sm">
                                {report.subtitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-34.5 p-[12px_24px]">
                          <span
                            className="font-sans text-sm font-normal leading-none tracking-normal"
                            style={{ color: "#525252" }}
                          >
                            {report.type}
                          </span>
                        </td>
                        <td className="w-34.5 p-[12px_24px]">
                          <StatusText status={report.status} />
                        </td>
                        <td className="w-34.5 p-[12px_24px]">
                          <div className="inline-flex flex-col items-end">
                            <p
                              className="font-sans text-sm font-semibold leading-none tracking-normal whitespace-nowrap"
                              style={{ color: "#E08A1E" }}
                            >
                              {report.keyMetrics.value}
                            </p>
                            <p
                              className="font-sans mt-1 text-xs font-normal leading-none tracking-normal whitespace-nowrap"
                              style={{ color: "#999999" }}
                            >
                              {report.keyMetrics.label}
                            </p>
                          </div>
                        </td>
                        <td className="w-34.5 p-[12px_24px]">
                          <span className="text-foreground text-sm hover:underline cursor-pointer">
                            {report.recipients}
                          </span>
                        </td>
                        <td className="w-34.5 p-[12px_24px]">
                          <span className="text-muted-foreground text-sm">
                            {report.date}
                          </span>
                        </td>
                        <td className="w-40.5 p-[12px_24px] text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => setSelectedReport(report)}
                              className="bg-secondary text-primary-foreground hover:bg-secondary/80 w-16.5 h-10 rounded-lg gap-1.5 py-2 px-4 text-sm font-medium transition-colors"
                            >
                              View
                            </Button>
                            <button
                              onClick={() => console.log("Download", report.id)}
                              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#E8E8E8] transition-colors hover:bg-[#d4d4d4]"
                              aria-label="Download report"
                            >
                              <Download className="size-4 text-[#121212]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

              {!isRefreshing && displayed.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-muted-foreground py-20 text-center text-sm"
                  >
                    No reports match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReportViewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onShare={(report) => setShareReport(report)}
      />

      <ShareReportModal
        report={shareReport}
        open={!!shareReport}
        onClose={() => setShareReport(null)}
      />
    </>
  );
}
