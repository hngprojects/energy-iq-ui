"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import {
  InverterTypeStep,
  type InverterType,
} from "@/components/onboarding/inverter-type-step";
import { InverterConnectionStep } from "@/components/onboarding/inverter-connection-step";
import { OnboardingSuccessDialog } from "@/components/onboarding/onboarding-success-dialog";
import { INVERTER_CONFIG } from "@/components/onboarding/inverter-config";
import { useAuthStore } from "@/stores/auth-store";
import { AuthService } from "@/services/auth-service";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { trackEvent, identifyUser } from "@/lib/analytics";
import { onboardingStorage } from "@/lib/onboarding-storage";

type Step = "select" | "connect";

function OnboardingContent() {
  const [step, setStep] = useState<Step>("select");
  const [inverter, setInverter] = useState<InverterType | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  
  // Loading states
  const [isSyncing, setIsSyncing] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const isCompleted = useRef(false);
  const stepRef = useRef<Step>(step);
  
  const { useOnboardingStatus } = useInverterQueries();
  const { data: onboardingStatus, isLoading: isStatusLoading, isError: isStatusError } = useOnboardingStatus();

  // 1. Google Auth Sync & Initial Token Check
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashString = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hashString);
    const sp = searchParams;

    const error = sp.get("error") || hashParams.get("error");
    if (error) {
      window.history.replaceState(null, "", window.location.pathname);
      toast.error("An account with this email already exists. Please sign in with your email and password.");
      router.replace("/login");
      return;
    }

    const token = sp.get("accessToken") || sp.get("token") || hashParams.get("accessToken") || hashParams.get("token");
    const refreshToken = sp.get("refreshToken") || hashParams.get("refreshToken") || "";

    if (token && !isAuthenticated) {
      window.history.replaceState(null, "", window.location.pathname);
      useAuthStore.setState({ token, refreshToken });

      AuthService.me()
        .then((realUser) => {
          if (realUser?.id) {
            setAuth(realUser, token, refreshToken);
          } else {
            logout();
            router.replace("/login");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          logout();
          router.replace("/login");
        });
    } else if (!token && !isAuthenticated && !useAuthStore.getState().token) {
      // No token in URL, no session in store -> Go to login
      router.replace("/login");
    } else {
      // We either have a user or are waiting for one
      setIsSyncing(false);
    }
  }, [searchParams, setAuth, logout, isAuthenticated, router]);

  // 2. Handle Redirection and Onboarding Status
  useEffect(() => {
    if (!user?.id) return;

    identifyUser(user.id);

    // If local storage says we are done, redirect immediately
    if (onboardingStorage.isCompleted(user.id)) {
      isCompleted.current = true;
      router.replace("/dashboard");
      return;
    }

    // If API says we are done, redirect
    if (onboardingStatus?.onboardingComplete) {
      onboardingStorage.setCompleted(user.id);
      isCompleted.current = true;
      router.replace("/dashboard");
      return;
    }

    // If API errors out, we assume they need to onboard (stop loading)
    if (isStatusError) {
       // We can stay on the page
    }
  }, [user, onboardingStatus, isStatusError, router]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Track page unload / tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isCompleted.current) {
        trackEvent("Onboarding Abandoned", {
          screen_name: step === "select" ? "Inverter Type Selection" : "Inverter Connection Details",
          exit_type: "tab_close",
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  useEffect(() => {
    return () => {
      if (!isCompleted.current) {
        trackEvent("Onboarding Abandoned", {
          screen_name:
            stepRef.current === "select"
              ? "Inverter Type Selection"
              : "Inverter Connection Details",
          exit_type: "client_navigation",
        });
      }
    };
  }, []);

  // Show loading while syncing auth or fetching status
  const showLoading = isSyncing || (isAuthenticated && isStatusLoading);

  if (showLoading) {
    return (
      <div className="mt-28 flex items-center justify-center lg:mt-44">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mt-28 lg:mt-44">
      {step === "select" ? (
        <>
          <AuthHeader
            title="What Inverter Type do you Use?"
            subtitle="Select your Inverter type so we can tailor your experience"
          />
          <InverterTypeStep
            selected={inverter}
            onSelect={setInverter}
            onNext={() => inverter && setStep("connect")}
            onCancel={() => router.push("/")}
          />
        </>
      ) : (
        inverter && (
          <>
            <AuthHeader
              title={`${INVERTER_CONFIG[inverter.toLowerCase()]?.name || inverter} Inverter Connection`}
              subtitle="Enter specific details of your inverter type"
            />
            <InverterConnectionStep
              key={inverter}
              inverter={inverter}
              onBack={() => setStep("select")}
              onConnected={() => {
                isCompleted.current = true;
                setSuccessOpen(true);
              }}
            />
          </>
        )
      )}
      <OnboardingSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <AuthWrapper>
      <Suspense fallback={
        <div className="mt-28 flex items-center justify-center lg:mt-44">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }>
        <OnboardingContent />
      </Suspense>
    </AuthWrapper>
  );
}
