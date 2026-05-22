import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsService } from "@/services/alerts-service";
export const ALERT_QUERY_KEYS = {
  all: ["alerts"] as const,
  lists: () => [...ALERT_QUERY_KEYS.all, "list"] as const,
  summary: () => [...ALERT_QUERY_KEYS.all, "summary"] as const,
  detail: (id: string) => [...ALERT_QUERY_KEYS.all, "detail", id] as const,
};
export function useAlerts() {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.lists(),
    queryFn: alertsService.getAllAlerts,
  });
}
export function useAlertSummary() {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.summary(),
    queryFn: alertsService.getAlertSummary,
  });
}
export function useAlertDetail(id: string | null) {
  return useQuery({
    queryKey: ALERT_QUERY_KEYS.detail(id || ""),
    queryFn: () => alertsService.getAlertById(id!),
    enabled: !!id,
  });
}
export function useResolveAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsService.resolveAlert,
    onSuccess: (_, id) => {
      // Invalidate queries to trigger background refreshes across panels
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.summary() });
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.detail(id) });
    },
  });
}
