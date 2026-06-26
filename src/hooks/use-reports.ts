import { useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { reportsService, ReportsPagination, DEFAULT_PAGINATION } from "@/services/reports-service";
import { mapApiReportToReport } from "@/lib/reports/map-api-report";
import { Report } from "@/lib/mocks/reports-data";
import { toast } from "sonner";

export function useReports(pageNumber = 1, pageSize = 10, reportType?: string) {
  const { isAuthenticated } = useAuthStore();
  const { useUserInverters } = useInverterQueries();
  const { data: inverters } = useUserInverters();
  const inverterId = inverters?.[0]?.id;

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reports", pageNumber, pageSize, reportType ?? "all"],
    queryFn: () => reportsService.getReports(pageNumber, pageSize, reportType),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const reports: Report[] = (data?.reports ?? []).map(mapApiReportToReport);
  const pagination: ReportsPagination = data?.pagination ?? DEFAULT_PAGINATION;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  const cancelReport = async (id: string) => {
    const toastId = toast.loading("Cancelling report...");
    try {
      await reportsService.cancelReport(id);
      toast.success("Report cancelled successfully!", { id: toastId });
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel report";
      toast.error(message, { id: toastId });
    }
  };

  const deleteReport = async (id: string) => {
    const toastId = toast.loading("Deleting report...");
    try {
      await reportsService.deleteReport(id);
      toast.success("Report deleted successfully!", { id: toastId });
      invalidate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete report";
      toast.error(message, { id: toastId });
    }
  };

  const downloadReport = async (
    report: Report,
    onStart: (id: string) => void,
    onComplete: (id: string, name: string) => void,
    onError: (id: string) => void,
  ) => {
    onStart(report.id);
    try {
      const blob = await reportsService.downloadReport(report.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 0);
      onComplete(report.id, report.title);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to download report";
      toast.error(message);
      onError(report.id);
    }
  };

  return {
    reports,
    pagination,
    isLoading,
    inverterId,
    invalidate,
    cancelReport,
    deleteReport,
    downloadReport,
  };
}
