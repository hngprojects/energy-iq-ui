"use client";

import { useState } from "react";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import {
  InverterTypeStep,
  type InverterType,
} from "@/components/onboarding/inverter-type-step";
import { InverterConnectionStep } from "@/components/onboarding/inverter-connection-step";
import { OnboardingSuccessDialog } from "@/components/onboarding/onboarding-success-dialog";
import { INVERTER_CONFIG } from "@/components/onboarding/inverter-config";

type Step = "select" | "connect";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("select");
  const [inverter, setInverter] = useState<InverterType | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <AuthWrapper>
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
