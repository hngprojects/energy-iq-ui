"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Download,
  MoreVertical,
  Trash2,
  Ban,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { ApiReport } from "@/types/reports";
import {
  Report,
  ReportFilterType,
  FILTER_OPTIONS,
} from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReportViewModal } from "@/components/dashboard/reports/report-view-modal";
import { ShareReportModal } from "@/components/dashboard/reports/share-report-modal";
import { ReportsNotificationToast } from "@/components/dashboard/reports/reports-notification-toast";
import { GenerateReportModal, formatDateRange } from "@/components/dashboard/reports/generate-report-modal";
import { ScheduleReportModal } from "@/components/dashboard/reports/schedule-report-modal";
import { REPORT_ICON_MAP, REPORT_FREQUENCY_LABELS } from "@/constants/reports";
import { PaginationBar } from "@/components/dashboard/shared/pagination-bar";
import { reportsService } from "@/services/reports-service";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";



function StatusText({ status }: { status: string }) {
  const normalized = status?.toUpperCase() || "PENDING";
  const isPending = normalized === "PENDING";
  const isCancelled = normalized === "CANCELLED";

  let bg = "var(--color-success-bg)";
  let color = "var(--color-success-alt)";

  if (isPending) {
    bg = "var(--color-warning-bg)";
    color = "var(--color-warning)";
  } else if (isCancelled) {
    bg = "var(--color-slate-20)";
    color = "var(--color-slate-70)";
  }

  const label = normalized.charAt(0) + normalized.slice(1).toLowerCase();

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold animate-fade-in"
      style={{
        backgroundColor: bg,
        color: color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse"
        style={{
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  );
}

export function mapApiReportToReport(apiRes: ApiReport): Report {
  let type = "Weekly";
  if (apiRes.type === "SOLAR") {
    type = "Solar";
  } else if (apiRes.type === "ALERT") {
    type = "Alert";
  } else if (apiRes.type === "COSTS_AND_SAVINGS") {
    type = "Device";
  } else if (apiRes.period === "monthly") {
    type = "Monthly";
  } else if (apiRes.period === "weekly") {
    type = "Weekly";
  }

  let metricValue = "0 kWh";
  let metricLabel = "Solar";

  if (apiRes.type === "ALERT") {
    const alertsCount = apiRes.keyMetrics?.totalAlerts ?? 0;
    metricValue = `${alertsCount} alerts`;
    metricLabel = "Logged";
  } else if (apiRes.type === "COSTS_AND_SAVINGS") {
    const costSaved = apiRes.keyMetrics?.totalCostSavedNgn ?? 0;
    if (costSaved > 0) {
      metricValue = `₦${costSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      metricLabel = "Saved";
    } else {
      metricValue = "₦0";
      metricLabel = "Saved";
    }
  } else {
    const energy = apiRes.keyMetrics?.totalEnergyConsumedKwh ?? 0;
    if (energy > 0) {
      metricValue = `${energy.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh`;
    }
  }

  let displayDateRange = "";
  if (apiRes.startDate && apiRes.endDate) {
    displayDateRange = formatDateRange(apiRes.startDate, apiRes.endDate);
  } else if (apiRes.referenceDate) {
    const d = new Date(apiRes.referenceDate);
    displayDateRange = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  let iconType: any = "file";
  const lowerType = type.toLowerCase();
  if (lowerType === "weekly") iconType = "file";
  else if (lowerType === "monthly") iconType = "calendar";
  else if (lowerType === "solar") iconType = "solar";
  else if (lowerType === "alert") iconType = "alert";
  else if (lowerType === "device") iconType = "chip";

  return {
    id: apiRes.id,
    title: apiRes.name || `${type} Report`,
    subtitle: displayDateRange || apiRes.period || "weekly",
    type: type,
    status: (apiRes.status as any) || "READY",
    date: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(apiRes.createdAt || Date.now())),
    iconType: iconType,
    keyMetrics: {
      value: metricValue,
      label: metricLabel,
    },
    recipients: "Me",
  };
}

function ReportCard({
  report,
  onView,
  downloadingId,
  completedId,
  onDownload,
  onCancel,
  onDelete,
}: {
  report: Report;
  onView: () => void;
  downloadingId: string | null;
  completedId: string | null;
  onDownload: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const Icon = REPORT_ICON_MAP[report.iconType];
  const isMock = ["1", "2", "3", "4", "5", "6", "7"].includes(report.id);
  const isPending = report.status?.toUpperCase() === "PENDING";
  const showMoreOptions = !isMock || isPending;

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
                {!isMock && (
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
          <StatusText status={report.status} />
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-(--color-border-disabled) flex size-10 shrink-0 items-center justify-center rounded-full">
            <Icon className="text-foreground size-4" />
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
            onClick={onDownload}
            variant="outline"
            className={cn(
              "border-border text-foreground flex h-10 flex-1 items-center justify-center rounded-lg border bg-transparent p-[8px_16px] text-xs font-medium",
              report.status?.toUpperCase() !== "READY" && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
            disabled={downloadingId === report.id || completedId === report.id || report.status?.toUpperCase() !== "READY"}
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
        <Button
          variant="outline"
          className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
        >
          <span className="text-muted-foreground">Report Type:</span>
          <span className="text-foreground hidden sm:inline">{currentLabel}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </Button>
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
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportFilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [shareReport, setShareReport] = useState<Report | null>(null);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [downloadedReportName, setDownloadedReportName] = useState<string>("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [showGenerateToast, setShowGenerateToast] = useState(false);
  const [generatedReportName, setGeneratedReportName] = useState("");
  const [lastGeneratedReport, setLastGeneratedReport] = useState<Report | null>(null);
  
  const [showScheduleToast, setShowScheduleToast] = useState(false);
  const [scheduledReportDetails, setScheduledReportDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Inverter integration
  const { useUserInverters } = useInverterQueries();
  const { data: inverters } = useUserInverters();
  const inverterId = inverters?.[0]?.id || "e2af3d6a-decf-46b6-a4a5-fb96e7c1ee80";

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const apiReports = await reportsService.getReports();
      const mapped = apiReports.map(mapApiReportToReport);
      setReports(mapped);
    } catch (err: any) {
      console.error("Failed to fetch reports", err);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const handleCancelReport = async (id: string) => {
    const toastId = toast.loading("Cancelling report...");
    try {
      await reportsService.cancelReport(id);
      toast.success("Report cancelled successfully!", { id: toastId });
      fetchReports();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to cancel report", { id: toastId });
    }
  };

  const handleDeleteReport = async (id: string) => {
    const toastId = toast.loading("Deleting report...");
    try {
      await reportsService.deleteReport(id);
      toast.success("Report deleted successfully!", { id: toastId });
      fetchReports();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete report", { id: toastId });
    }
  };

  const handleDownload = async (report: Report) => {
    if (downloadingId || completedId) return;

    // For real reports
    setDownloadingId(report.id);
    setCompletedId(null);
    try {
      const blob = await reportsService.downloadReport(report.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeTitle = report.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      a.download = `${safeTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setDownloadingId(null);
      setCompletedId(report.id);
      setDownloadedReportName(report.title);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to download report");
      setDownloadingId(null);
    }
  };

  const displayed = useMemo(
    () => filterReports(reports, filter),
    [filter, reports],
  );
  const totalPages = Math.max(1, Math.ceil(displayed.length / itemsPerPage));
  const paginatedReports = displayed.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChange = (nextFilter: ReportFilterType) => {
    setFilter(nextFilter);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4 sm:gap-0 sm:bg-card sm:border-border sm:overflow-hidden sm:rounded-xl sm:border">
        {/* Toolbar */}
        <div className="flex h-auto w-full items-center justify-between gap-3 sm:border-border sm:h-19.75 sm:flex-row sm:justify-between sm:border-b sm:px-6 lg:gap-2">
          {/* Filter */}
          <FilterDropdown value={filter} onChange={handleFilterChange} />

          {/* Action Buttons — stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowScheduleModal(true)}
              className="border-border text-foreground h-8 w-35 rounded-lg border bg-transparent p-[8px_16px] text-xs font-medium sm:h-10 sm:w-35.75 sm:text-sm"
            >
              <span className="sm:hidden">Schedule</span>
              <span className="hidden sm:inline">Schedule Report</span>
            </Button>
            <Button
              onClick={() => setShowGenerateModal(true)}
              className="bg-secondary text-primary-foreground hover:bg-secondary/80 h-8 w-35 rounded-lg p-[8px_16px] text-xs font-medium sm:h-10 sm:w-35.75 sm:text-sm"
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="flex flex-col gap-4 sm:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card h-51.5 w-full animate-pulse rounded-[8px] border border-border"
                />
              ))
            : paginatedReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => setSelectedReport(report)}
                  downloadingId={downloadingId}
                  completedId={completedId}
                  onDownload={() => handleDownload(report)}
                  onCancel={() => handleCancelReport(report.id)}
                  onDelete={() => handleDeleteReport(report.id)}
                />
              ))}
          {!isLoading && displayed.length === 0 && (
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
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : paginatedReports.map((report) => {
                    const Icon = REPORT_ICON_MAP[report.iconType];
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
                            style={{ color: "var(--color-slate-80)" }}
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
                              style={{ color: "var(--color-amber-60)" }}
                            >
                              {report.keyMetrics.value}
                            </p>
                            <p
                              className="font-sans mt-1 text-xs font-normal leading-none tracking-normal whitespace-nowrap"
                              style={{ color: "var(--color-slate-70)" }}
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
                                onClick={() => handleDownload(report)}
                                disabled={report.status?.toUpperCase() !== "READY"}
                                className={cn(
                                  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-border-disabled) transition-colors hover:bg-(--color-slate-30) p-0 text-foreground hover:text-foreground",
                                  report.status?.toUpperCase() !== "READY" && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                )}
                                aria-label="Download report"
                              >
                                <Download className="size-4 text-foreground" />
                              </Button>
                            )}

                            {/* Three dots actions menu */}
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
                                  {report.status?.toUpperCase() === "PENDING" && (
                                    <DropdownMenu.Item
                                      onSelect={() => handleCancelReport(report.id)}
                                      className="cursor-pointer px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 outline-none transition-colors flex items-center gap-1.5"
                                    >
                                      <Ban className="size-3.5" />
                                      Cancel Report
                                    </DropdownMenu.Item>
                                  )}
                                  <DropdownMenu.Item
                                    onSelect={() => handleDeleteReport(report.id)}
                                    className="cursor-pointer px-4 py-2.5 text-sm text-destructive hover:bg-red-50 outline-none transition-colors flex items-center gap-1.5"
                                  >
                                    <Trash2 className="size-3.5" />
                                    Delete Report
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

              {!isLoading && displayed.length === 0 && (
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
        {!isLoading ? (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayed.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(perPage) => {
              setItemsPerPage(perPage);
              setCurrentPage(1);
            }}
            itemLabel="reports"
          />
        ) : null}
      </div>

      <ReportViewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onShare={(report) => setShareReport(report)}
        onDownload={(report) => handleDownload(report)}
      />

      <ShareReportModal
        report={shareReport}
        open={!!shareReport}
        onClose={() => setShareReport(null)}
      />

      <ReportsNotificationToast
        open={!!completedId}
        onClose={() => setCompletedId(null)}
        title="Download ready"
        description={`${downloadedReportName}.pdf`}
        actionText="Open file"
        onAction={() => toast.success(`Opening ${downloadedReportName}.pdf`)}
      />

      <ReportsNotificationToast
        open={showGenerateToast}
        onClose={() => setShowGenerateToast(false)}
        title="Report generated"
        description={generatedReportName}
        actionText="Open file"
        onAction={() => {
          if (lastGeneratedReport) {
            handleDownload(lastGeneratedReport);
          }
          setShowGenerateToast(false);
        }}
      />

      <ReportsNotificationToast
        open={showScheduleToast}
        onClose={() => setShowScheduleToast(false)}
        title="Report Scheduled"
        description={scheduledReportDetails}
        actionText="Open file"
        onAction={() => {}}
      />

      <GenerateReportModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={async ({ title, type, startDate, endDate }) => {
          try {
            let backendType = "GENERAL";
            if (type === "solar") {
              backendType = "SOLAR";
            } else if (type === "alerts") {
              backendType = "ALERT";
            } else if (type === "device") {
              backendType = "COSTS_AND_SAVINGS";
            }

            let period = "weekly";
            if (type === "monthly") {
              period = "monthly";
            } else if (type === "solar") {
              period = "daily";
            }

            const refDate = startDate || new Date().toISOString().split("T")[0];

            const payload = {
              mode: "period" as const,
              inverterId: inverterId,
              type: backendType,
              name: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
              period: period,
              referenceDate: refDate,
              startDate: startDate || refDate,
              endDate: endDate || refDate,
              recurring: false,
            };

            const toastId = toast.loading("Generating report...");
            const apiRes = await reportsService.createReport(payload);
            const newReport = mapApiReportToReport(apiRes);

            setLastGeneratedReport(newReport);
            setGeneratedReportName(`${newReport.title}.pdf`);
            toast.success("Report generated successfully!", { id: toastId });
            setShowGenerateToast(true);
            fetchReports();
          } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Failed to generate report");
          }
        }}
      />

      <ScheduleReportModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSaveSchedule={async ({ type, time, title }) => {
          try {
            let backendType = "GENERAL";
            if (type === "solar") {
              backendType = "SOLAR";
            } else if (type === "alerts") {
              backendType = "ALERT";
            } else if (type === "device") {
              backendType = "COSTS_AND_SAVINGS";
            }

            let period = "weekly";
            if (type === "monthly") {
              period = "monthly";
            } else if (type === "solar") {
              period = "daily";
            }

            const refDate = new Date().toISOString().split("T")[0];

            const payload = {
              mode: "period" as const,
              inverterId: inverterId,
              type: backendType,
              name: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
              period: period,
              referenceDate: refDate,
              startDate: refDate,
              endDate: refDate,
              recurring: true,
            };

            const toastId = toast.loading("Scheduling report...");
            const apiRes = await reportsService.createReport(payload);

            const displayTitle = apiRes.name || payload.name;
            setScheduledReportDetails(`${displayTitle} - ${REPORT_FREQUENCY_LABELS[type as keyof typeof REPORT_FREQUENCY_LABELS] ?? type}, ${time}`);
            toast.success("Report scheduled successfully!", { id: toastId });
            setShowScheduleToast(true);
            fetchReports();
          } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Failed to schedule report");
          }
        }}
      />
    </>
  );
}
