import { useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { reportsService, ReportsPagination } from "@/services/reports-service";
import { mapApiReportToReport } from "@/components/dashboard/reports/table/reports-table";
import { Report } from "@/lib/mocks/reports-data";
import { toast } from "sonner";

const DEFAULT_PAGINATION: ReportsPagination = {
  total: 0,
  total_pages: 1,
  page: 1,
  has_next: false,
  has_previous: false,
};

export function useReports(pageNumber = 1, pageSize = 10) {
  const { isAuthenticated } = useAuthStore();
  const { useUserInverters } = useInverterQueries();
  const { data: inverters } = useUserInverters();
  const inverterId = inverters?.[0]?.id || "e2af3d6a-decf-46b6-a4a5-fb96e7c1ee80";

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reports", pageNumber, pageSize],
    queryFn: () => reportsService.getReports(pageNumber, pageSize),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const reports: Report[] = (data?.reports ?? []).map(mapApiReportToReport);
  const pagination: ReportsPagination = data?.pagination ?? DEFAULT_PAGINATION;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["reports-summary"] });
  };

  const cancelReport = async (id: string) => {
    const toastId = toast.loading("Cancelling report...");
    try {
      await reportsService.cancelReport(id);
      toast.success("Report cancelled successfully!", { id: toastId });
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel report", { id: toastId });
    }
  };

  const deleteReport = async (id: string) => {
    const toastId = toast.loading("Deleting report...");
    try {
      await reportsService.deleteReport(id);
      toast.success("Report deleted successfully!", { id: toastId });
      invalidate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete report", { id: toastId });
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
      window.URL.revokeObjectURL(url);
      a.remove();
      onComplete(report.id, report.title);
    } catch (err: any) {
      toast.error(err?.message || "Failed to download report");
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
