import { useMutation, useQuery } from "@tanstack/react-query";
import { InverterService } from "@/services/inverter-service";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const useInverterQueries = () => {
  const { isAuthenticated } = useAuthStore();

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
        toast.success("Inverter connected successfully!", {
          duration: 5000,
        });
        onSuccess?.();
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : (error as { message?: string })?.message ||
              "Failed to connect inverter";
        toast.error(message, {
          duration: 5000,
        });
      },
    });

  return {
    useSupportedBrands,
    useConnectInverter,
  };
};
