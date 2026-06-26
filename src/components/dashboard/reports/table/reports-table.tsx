"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { Report, ReportFilterType, FILTER_OPTIONS } from "@/lib/mocks/reports-data";
import type { ReportIconType, ReportStatus } from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReportViewModal } from "@/components/dashboard/reports/modals/report-view-modal";
import { ShareReportModal } from "@/components/dashboard/reports/modals/share-report-modal";
import { ReportsNotificationToast } from "@/components/dashboard/reports/reports-notification-toast";
import { GenerateReportModal, formatDateRange } from "@/components/dashboard/reports/modals/generate-report-modal";
import { ScheduleReportModal } from "@/components/dashboard/reports/modals/schedule-report-modal";
import { ReportCardMobile } from "@/components/dashboard/reports/card/report-card-mobile";
import { ReportTableDesktop } from "@/components/dashboard/reports/table/report-table-desktop";
import {
  REPORT_FREQUENCY_LABELS,
  REPORT_BACKEND_TYPE_MAP,
  REPORT_PERIOD_MAP,
  ReportType,
} from "@/constants/reports";
import { PaginationBar } from "@/components/dashboard/shared/pagination-bar";
import { reportsService } from "@/services/reports-service";
import { useReports } from "@/hooks/use-reports";
import { ApiReport as ApiReportType } from "@/types/reports";

export function mapApiReportToReport(apiRes: ApiReportType): Report {
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
    const alertsCount = Number(apiRes.keyMetrics?.totalAlerts ?? 0);
    metricValue = `${alertsCount} alerts`;
    metricLabel = "Logged";
  } else if (apiRes.type === "COSTS_AND_SAVINGS") {
    const costSaved = Number(apiRes.keyMetrics?.totalCostSavedNgn ?? 0);
    metricValue = costSaved > 0
      ? `₦${costSaved.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
      : "₦0";
    metricLabel = "Saved";
  } else {
    const energy = Number(apiRes.keyMetrics?.totalEnergyConsumedKwh ?? 0);
    if (energy > 0) {
      metricValue = `${energy.toLocaleString("en-NG", { maximumFractionDigits: 0 })} kWh`;
    }
  }

  let displayDateRange = "";
  if (apiRes.startDate && apiRes.endDate) {
    displayDateRange = formatDateRange(apiRes.startDate, apiRes.endDate);
  } else if (apiRes.referenceDate) {
    const d = new Date(apiRes.referenceDate);
    displayDateRange = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  const lowerType = type.toLowerCase();
  let iconType: ReportIconType = "file";
  if (lowerType === "monthly") iconType = "calendar";
  else if (lowerType === "solar") iconType = "solar";
  else if (lowerType === "alert") iconType = "alert";
  else if (lowerType === "device") iconType = "chip";

  return {
    id: apiRes.id,
    title: apiRes.name || `${type} Report`,
    subtitle: displayDateRange || apiRes.period || "weekly",
    type,
    status: (apiRes.status as ReportStatus) || "READY",
    date: new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(apiRes.createdAt || Date.now())),
    iconType,
    keyMetrics: { value: metricValue, label: metricLabel },
    recipients: "Me",
  };
}

function FilterDropdown({
  value,
  onChange,
}: {
  value: ReportFilterType;
  onChange: (v: ReportFilterType) => void;
}) {
  const currentLabel = FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "All";

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

const FILTER_TO_BACKEND_TYPE: Partial<Record<ReportFilterType, string>> = {
  Solar: "SOLAR",
  Alert: "ALERT",
  Device: "COSTS_AND_SAVINGS",
  Weekly: "GENERAL",
  Monthly: "GENERAL",
};

export function ReportsTable() {
  const [filter, setFilter] = useState<ReportFilterType>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [shareReport, setShareReport] = useState<Report | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [downloadedReportName, setDownloadedReportName] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showGenerateToast, setShowGenerateToast] = useState(false);
  const [generatedReportName, setGeneratedReportName] = useState("");
  const [lastGeneratedReport, setLastGeneratedReport] = useState<Report | null>(null);
  const [showScheduleToast, setShowScheduleToast] = useState(false);
  const [scheduledReportDetails, setScheduledReportDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { reports, pagination, isLoading, inverterId, invalidate, cancelReport, deleteReport, downloadReport } = useReports(currentPage, itemsPerPage, FILTER_TO_BACKEND_TYPE[filter]);

  const handleDownload = (report: Report) => {
    if (downloadingId === report.id || completedId === report.id) return;
    downloadReport(
      report,
      (id) => { setDownloadingId(id); setCompletedId(null); },
      (id, name) => { setDownloadingId(null); setCompletedId(id); setDownloadedReportName(name); },
      () => setDownloadingId(null),
    );
  };

  const handleFilterChange = (next: ReportFilterType) => {
    setFilter(next);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-4 sm:gap-0 sm:bg-card sm:border-border sm:overflow-hidden sm:rounded-xl sm:border">
        <div className="flex h-auto w-full items-center justify-between gap-3 sm:border-border sm:h-19.75 sm:flex-row sm:justify-between sm:border-b sm:px-6 lg:gap-2">
          <FilterDropdown value={filter} onChange={handleFilterChange} />
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

        <div className="flex flex-col gap-4 sm:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card h-51.5 w-full animate-pulse rounded-[8px] border border-border" />
              ))
            : reports.map((report) => (
                <ReportCardMobile
                  key={report.id}
                  report={report}
                  onView={() => setSelectedReport(report)}
                  downloadingId={downloadingId}
                  completedId={completedId}
                  onDownload={() => handleDownload(report)}
                  onCancel={() => cancelReport(report.id)}
                  onDelete={() => deleteReport(report.id)}
                />
              ))}
          {!isLoading && reports.length === 0 && (
            <div className="text-muted-foreground py-20 text-center text-sm">
              No reports match this filter.
            </div>
          )}
        </div>

        <ReportTableDesktop
          reports={reports}
          isLoading={isLoading}
          downloadingId={downloadingId}
          completedId={completedId}
          onView={setSelectedReport}
          onDownload={handleDownload}
          onCancel={cancelReport}
          onDelete={deleteReport}
        />

        {!isLoading && (
          <PaginationBar
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(perPage) => { setItemsPerPage(perPage); setCurrentPage(1); }}
            itemLabel="reports"
          />
        )}
      </div>

      <ReportViewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onShare={(report) => setShareReport(report)}
        onDownload={handleDownload}
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
          if (lastGeneratedReport) handleDownload(lastGeneratedReport);
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
            const reportType = type as ReportType;
            const backendType = REPORT_BACKEND_TYPE_MAP[reportType] ?? "GENERAL";
            const period = REPORT_PERIOD_MAP[reportType] ?? "weekly";
            const refDate = startDate || new Date().toISOString().split("T")[0];

            const payload = {
              mode: "period" as const,
              inverterId: inverterId ?? "",
              type: backendType,
              name: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
              period,
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
            invalidate();
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to generate report";
            toast.error(message);
          }
        }}
      />

      <ScheduleReportModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSaveSchedule={async ({ type, time, title }) => {
          try {
            const reportType = type as ReportType;
            const backendType = REPORT_BACKEND_TYPE_MAP[reportType] ?? "GENERAL";
            const period = REPORT_PERIOD_MAP[reportType] ?? "weekly";
            const refDate = new Date().toISOString().split("T")[0];

            const payload = {
              mode: "period" as const,
              inverterId: inverterId ?? "",
              type: backendType,
              name: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
              period,
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
            invalidate();
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to schedule report";
            toast.error(message);
          }
        }}
      />
    </>
  );
}
