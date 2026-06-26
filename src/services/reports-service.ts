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

const DEFAULT_PAGINATION: ReportsPagination = {
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
      `/reports/download/${id}`,
      { method: "GET", responseType: "blob" },
      true,
    );
  },

  emailReport: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>(
      `/reports/email-report/${id}`,
      { method: "POST" },
      true,
    );
  },

  getReports: async (pageNumber = 1, pageSize = 10): Promise<GetReportsResult> => {
    let pagination: ReportsPagination = { ...DEFAULT_PAGINATION, page: pageNumber };

    const reports = await apiFetch<ApiReport[]>(
      "/reports",
      {
        method: "GET",
        params: { pageNumber, pageSize },
        transformResponse: (raw: string) => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.meta?.pagination) {
              pagination = parsed.meta.pagination;
            }
            return parsed?.data ?? parsed;
          } catch {
            return raw;
          }
        },
      },
      true,
    );

    return {
      reports: Array.isArray(reports) ? reports : [],
      pagination,
    };
  },

  getReportsSummary: async (): Promise<ReportsSummary> => {
    return apiFetch<ReportsSummary>("/reports/summary", { method: "GET" }, true);
  },

  deleteReport: async (id: string): Promise<void> => {
    return apiFetch<void>(`/reports/${id}`, { method: "DELETE" }, true);
  },

  cancelReport: async (id: string): Promise<ApiReport> => {
    return apiFetch<ApiReport>(`/reports/cancel/${id}`, { method: "PATCH" }, true);
  },
};
