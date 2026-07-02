"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  Report,
  ReportFilterType,
  FILTER_OPTIONS,
} from "@/lib/mocks/reports-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShareReportModal } from "@/components/dashboard/reports/modals/share-report-modal";
import { ReportsNotificationToast } from "@/components/dashboard/reports/reports-notification-toast";
import { GenerateReportModal } from "@/components/dashboard/reports/modals/generate-report-modal";
import { ReportCardMobile } from "@/components/dashboard/reports/card/report-card-mobile";
import { ReportTableDesktop } from "@/components/dashboard/reports/table/report-table-desktop";

import type { CreateReportPayload } from "@/types/reports";
import { PaginationBar } from "@/components/dashboard/shared/pagination-bar";
import { reportsService } from "@/services/reports-service";
import { useReports } from "@/hooks/use-reports";
import { mapApiReportToReport } from "@/lib/reports/map-api-report";

export { mapApiReportToReport };

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
          <span className="text-foreground hidden sm:inline">
            {currentLabel}
          </span>
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
  "Costs & Savings": "COSTS_AND_SAVINGS",
  Weekly: "GENERAL",
  Monthly: "GENERAL",
};

const FILTER_PERIOD: Partial<Record<ReportFilterType, string>> = {
  Weekly: "weekly",
  Monthly: "monthly",
};

export function ReportsTable() {
  const [filter, setFilter] = useState<ReportFilterType>("all");
  const [shareReport, setShareReport] = useState<Report | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [downloadedReportName, setDownloadedReportName] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showGenerateToast, setShowGenerateToast] = useState(false);
  const [generatedReportName, setGeneratedReportName] = useState("");
  const [lastGeneratedReport, setLastGeneratedReport] = useState<Report | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    reports: rawReports,
    pagination,
    isLoading,
    inverterId,
    invalidate,
    cancelReport,
    deleteReport,
    downloadReport,
  } = useReports(currentPage, itemsPerPage, FILTER_TO_BACKEND_TYPE[filter]);

  const reports = FILTER_PERIOD[filter]
    ? rawReports.filter((r) => r.type === filter)
    : rawReports;

  const handleDownload = (report: Report) => {
    if (downloadingId === report.id || completedId === report.id) return;
    downloadReport(
      report,
      (id) => {
        setDownloadingId(id);
        setCompletedId(null);
      },
      (id, name) => {
        setDownloadingId(null);
        setCompletedId(id);
        setDownloadedReportName(name);
      },
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
        <div className="flex h-auto w-full flex-col gap-3 border-border sm:h-19.75 sm:flex-row sm:items-center sm:justify-between sm:border-b sm:px-6 lg:gap-2">
          <div className="w-full sm:w-auto">
            <FilterDropdown value={filter} onChange={handleFilterChange} />
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              onClick={() => setShowGenerateModal(true)}
              className="bg-secondary text-primary-foreground hover:bg-secondary/80 h-11 flex-1 rounded-lg px-3 text-xs font-medium sm:h-10 sm:flex-none sm:w-35.75 sm:text-sm"
            >
              Generate Report
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:hidden">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card h-51.5 w-full animate-pulse rounded-[8px] border border-border"
                />
              ))
            : reports.map((report) => (
                <ReportCardMobile
                  key={report.id}
                  report={report}
                  onView={() => setShareReport(report)}
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
          onView={(report) => setShareReport(report)}
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
            onPerPageChange={(perPage) => {
              setItemsPerPage(perPage);
              setCurrentPage(1);
            }}
            itemLabel="reports"
          />
        )}
      </div>

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

      <GenerateReportModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={async (details) => {
          const toastId = toast.loading("Generating report...");

          try {
            let payload: CreateReportPayload;

            if (details.period === "weekly" || details.period === "monthly") {
              payload = {
                mode: "period",
                inverterId: inverterId ?? "",
                type: details.backendType,
                name: details.title,
                recurring: details.recurring,
                period: details.period,
                referenceDate: details.referenceDate!,
              };
            } else {
              payload = {
                mode: "custom-range",
                inverterId: inverterId ?? "",
                type: details.backendType,
                name: details.title,
                recurring: false,
                startDate: details.startDate!,
                endDate: details.endDate!,
              };
            }

            const apiRes = await reportsService.createReport(payload);
            const newReport = mapApiReportToReport(apiRes);

            setLastGeneratedReport(newReport);
            setGeneratedReportName(`${newReport.title}.pdf`);
            toast.success("Report generated successfully!", { id: toastId });
            setShowGenerateToast(true);
            invalidate();
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Failed to generate report";
            toast.error(message, { id: toastId });
          }
        }}
      />
    </>
  );
}
