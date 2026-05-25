"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useAuthStore } from "@/stores/auth-store";
import { onboardingStorage } from "@/lib/onboarding-storage";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();
  const { useOnboardingStatus } = useInverterQueries();
  const { data: status, isLoading, isError } = useOnboardingStatus();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentUrl = `${pathname}${search ? `?${search}` : ""}`;

  const isFullyOnboarded =
    status?.onboardingComplete === true &&
    status?.steps?.accountCreated === true &&
    status?.steps?.emailVerified === true &&
    status?.steps?.inverterConnected === true;

  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    
    if (!isLoading && !isError && !isFullyOnboarded) {
      router.replace("/onboarding");
    }
  }, [
    _hasHydrated,
    isAuthenticated,
    isLoading,
    isError,
    isFullyOnboarded,
    router,
    currentUrl,
  ]);

  useEffect(() => {
    if (isFullyOnboarded && user?.id) {
      onboardingStorage.setCompleted(user.id);
    }
  }, [isFullyOnboarded, user?.id]);

  // IMPORTANT: Wait for hydration before rendering anything or redirecting
  if (!_hasHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The useEffect will handle redirect
  }

  if (isLoading) {
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
