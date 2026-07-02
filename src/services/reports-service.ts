import { apiFetch } from "@/lib/api/client";
import { CreateReportPayload, ApiReport } from "@/types/reports";

export interface ReportsPagination {
  total: number;
  total_pages: number;
  page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface GetReportsResult {
  reports: ApiReport[];
  pagination: ReportsPagination;
}

export interface ReportsSummary {
  alerts: number;
  costsAndSavings: number;
  general: number;
  solar: number;
}

export const DEFAULT_PAGINATION: ReportsPagination = {
  total: 0,
  total_pages: 1,
  page: 1,
  has_next: false,
  has_previous: false,
};

export const reportsService = {
  createReport: async (payload: CreateReportPayload): Promise<ApiReport> => {
    return apiFetch<ApiReport>(
      "/reports",
      { method: "POST", data: payload },
      true,
    );
  },

  downloadReport: async (id: string): Promise<Blob> => {
    return apiFetch<Blob>(
      `/reports/${id}/download`,
      { method: "GET", responseType: "blob" },
      true,
    );
  },

  emailReport: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>(
      `/reports/email-report/${id}`,
      { method: "POST" },
      true,
    );
  },

  generateShareableLink: async (id: string): Promise<string> => {
    return apiFetch<string>(
      `/reports/${id}/generate-link`,
      { method: "POST" },
      true,
    );
  },

  getShareableLink: async (id: string): Promise<string> => {
    return apiFetch<string>(
      `/reports/${id}/shareable-link`,
      { method: "GET" },
      true,
    );
  },

  getSharedReportFileUrl: async (token: string): Promise<string> => {
    return apiFetch<string>(`/reports/share/${token}`, { method: "GET" }, true);
  },

  getReports: async (
    pageNumber = 1,
    pageSize = 10,
    reportType?: string,
  ): Promise<GetReportsResult> => {
    const envelope = await apiFetch<{
      success: boolean;
      reportsData: ApiReport[];
      meta: { pagination: ReportsPagination };
    }>(
      "/reports",
      {
        method: "GET",
        params: { pageNumber, pageSize, ...(reportType ? { reportType } : {}) },
        transformResponse: (raw: string) => {
          try {
            const parsed = JSON.parse(raw);
            if (
              parsed &&
              typeof parsed === "object" &&
              "success" in parsed &&
              "data" in parsed
            ) {
              return {
                success: parsed.success,
                reportsData: parsed.data,
                meta: parsed.meta,
              };
            }
            return parsed;
          } catch {
            return raw;
          }
        },
      },
      true,
    );

    const reports = (envelope?.reportsData ?? []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const pagination: ReportsPagination = envelope?.meta?.pagination ?? {
      ...DEFAULT_PAGINATION,
      page: pageNumber,
    };

    return { reports, pagination };
  },

  getReportsSummary: async (): Promise<ReportsSummary> => {
    return apiFetch<ReportsSummary>(
      "/reports/summary",
      { method: "GET" },
      true,
    );
  },

  deleteReport: async (id: string): Promise<void> => {
    return apiFetch<void>(`/reports/${id}`, { method: "DELETE" }, true);
  },

  cancelReport: async (id: string): Promise<ApiReport> => {
    return apiFetch<ApiReport>(
      `/reports/${id}/cancel`,
      { method: "PATCH" },
      true,
    );
  },
};
