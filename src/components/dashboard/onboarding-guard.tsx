"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useAuthStore } from "@/stores/auth-store";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();
  const { useOnboardingStatus } = useInverterQueries();
  const {
    data: status,
    isLoading,
    isFetching,
  } = useOnboardingStatus();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentUrl = `${pathname}${search ? `?${search}` : ""}`;
  const hashParams =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const hasIncomingOAuthToken =
    searchParams.has("accessToken") ||
    searchParams.has("token") ||
    hashParams.has("accessToken") ||
    hashParams.has("token");

  const isFullyOnboarded =
    user?.onboardingComplete === true ||
    status?.onboardingComplete === true &&
    status?.steps?.accountCreated === true &&
    status?.steps?.emailVerified === true &&
    status?.steps?.inverterConnected === true;
  const isBootstrappingOnboarding =
    !_hasHydrated ||
    (isAuthenticated && (!user?.id || isLoading || isFetching));

  useEffect(() => {
    if (!_hasHydrated) return;
    if (hasIncomingOAuthToken) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!isBootstrappingOnboarding) {
      if (status?.onboardingComplete === false && user?.onboardingComplete !== true) {
        router.replace("/onboarding");
      }
    }
  }, [
    _hasHydrated,
    hasIncomingOAuthToken,
    isAuthenticated,
    isBootstrappingOnboarding,
    isFullyOnboarded,
    status?.onboardingComplete,
    user?.onboardingComplete,
    user?.id,
    router,
    currentUrl,
  ]);

  // IMPORTANT: Wait for hydration before rendering anything or redirecting
  if (_hasHydrated === false || hasIncomingOAuthToken || isBootstrappingOnboarding) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (status?.onboardingComplete === false && user?.onboardingComplete !== true) {
    return null;
  }

  return <>{children}</>;
}

