"use client";

import { useState, useEffect, Suspense } from "react";
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

type Step = "select" | "connect";

function GoogleAuthSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashString = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hashString);

    const error =
      searchParams.get("error") || hashParams.get("error");

    if (error) {
      window.history.replaceState(null, "", window.location.pathname);
      toast.error(
        "An account with this email already exists. Please sign in with your email and password.",
        { duration: 6000 },
      );
      router.replace("/login");
      return;
    }

    const token =
      searchParams.get("accessToken") ||
      searchParams.get("token") ||
      hashParams.get("accessToken") ||
      hashParams.get("token");

    const refreshToken =
      searchParams.get("refreshToken") ||
      hashParams.get("refreshToken") ||
      "";

    if (token && !isAuthenticated) {
      window.history.replaceState(null, "", window.location.pathname);
      useAuthStore.setState({ token, refreshToken });

      AuthService.me()
        .then((realUser) => {
          if (realUser?.id) {
            setAuth(realUser, token, refreshToken);
            router.replace("/onboarding");
          } else {
            logout();
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err);
          logout();
        });
    }
  }, [searchParams, setAuth, logout, isAuthenticated, router]);

  return null;
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("select");
  const [inverter, setInverter] = useState<InverterType | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  return (
    <AuthWrapper>
      <Suspense fallback={null}>
        <GoogleAuthSync />
      </Suspense>
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
                onConnected={() => setSuccessOpen(true)}
              />
            </>
          )
        )}
      </div>
      <OnboardingSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />
    </AuthWrapper>
  );
}
