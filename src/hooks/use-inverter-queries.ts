import { useMutation, useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { InverterService } from "@/services/inverter-service";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const useInverterQueries = () => {
  const { isAuthenticated, user } = useAuthStore();

  const useSupportedBrands = () =>
    useQuery({
      queryKey: ["supported-brands"],
      queryFn: InverterService.getSupportedBrands,
      enabled: isAuthenticated,
      retry: false,
    });

  const useConnectInverter = (onSuccess?: () => void) =>
    useMutation({
      mutationFn: InverterService.connectInverter,
      onSuccess: () => {
        toast.success("Inverter connected successfully!");
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : (error as { message?: string })?.message ||
              "Failed to connect inverter";
        toast.error(message);
      },
    });

  const useUserInverters = () =>
    useQuery({
      queryKey: ["user-inverters", user?.id],
      queryFn: () => InverterService.getUserInverters(user!.id),
      enabled: isAuthenticated && !!user?.id,
      staleTime: 1000 * 60 * 5,
    });

  const useDashboardMetrics = (inverterId: string | undefined) =>
    useQuery({
      queryKey: ["dashboard-metrics", inverterId],
      queryFn: () => InverterService.getDashboardMetrics(inverterId!),
      enabled: isAuthenticated && !!inverterId,
      refetchInterval: 30_000,
    });

  const useEnergyUsage = (inverterId: string | undefined, period: string) =>
    useQuery({
      queryKey: ["energy-usage", inverterId, period],
      queryFn: () => InverterService.getEnergyUsage(inverterId!, period),
      enabled: isAuthenticated && !!inverterId,
      refetchInterval: 60_000,
      placeholderData: keepPreviousData,
    });

  const usePowerConsumption = (inverterId: string | undefined) =>
    useQuery({
      queryKey: ["power-consumption", inverterId],
      queryFn: () => InverterService.getPowerConsumption(inverterId!),
      enabled: isAuthenticated && !!inverterId,
      refetchInterval: 30_000,
    });

  return {
    useSupportedBrands,
    useConnectInverter,
    useUserInverters,
    useDashboardMetrics,
    useEnergyUsage,
    usePowerConsumption,
  };
};
