"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useAuthStore } from "@/stores/auth-store";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { useOnboardingStatus } = useInverterQueries();
  const { data: status, isLoading, isError } = useOnboardingStatus();

  const isFullyOnboarded =
    status?.onboardingComplete === true &&
    status?.steps?.accountCreated === true &&
    status?.steps?.emailVerified === true &&
    status?.steps?.inverterConnected === true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isLoading && !isError && !isFullyOnboarded) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isLoading, isError, isFullyOnboarded, router]);

  if (!isAuthenticated || isLoading || (!isError && !isFullyOnboarded)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground"
      >
        Unable to verify onboarding status. Please refresh and try again.
      </div>
    );
  }

  if (!isFullyOnboarded) return null;

  return <>{children}</>;
}
