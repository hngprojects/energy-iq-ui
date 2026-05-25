"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";
import { cn } from "@/lib/utils";
import type { InverterType } from "./inverter-type-step";
import { INVERTER_CONFIG, type InverterFieldConfig } from "./inverter-config";
import { getSolarmanEmailError } from "@/lib/schemas/onboarding";
import { AuthInput } from "@/components/auth/auth-input";

import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useAuthStore } from "@/stores/auth-store";
import type { ConnectInverterRequest } from "@/types/inverter";
import { trackEvent } from "@/lib/analytics";
import { useOnboardingStore } from "@/stores/onboarding-store";

interface InverterConnectionStepProps {
  onBack: () => void;
  onConnected: () => void;
}

export function InverterConnectionStep({
  onBack,
  onConnected,
}: InverterConnectionStepProps) {
  const { inverterType: inverter, connectionDetails, setConnectionDetails } = useOnboardingStore();
  const { user } = useAuthStore();
  const { useConnectInverter } = useInverterQueries();
  const [helperOpen, setHelperOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const connectInverterMutation = useConnectInverter(onConnected);

  useEffect(() => {
    if (inverter) {
      trackEvent("Screen View", { screen_name: "Inverter Connection Details", inverter_type: inverter });
    }
  }, [inverter]);

  if (!inverter) {
    return null; // Should not happen if store is correct
  }

  const config = INVERTER_CONFIG[inverter.toLowerCase()];

  const rawValues = connectionDetails[inverter.toLowerCase()] ?? [];
  const values = (config?.fields ?? []).map((_, i) => rawValues[i] ?? "");
  const setValues = (newValues: string[]) => setConnectionDetails(inverter, newValues);

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          Configuration for {inverter} is not currently available.
        </div>
        <Button onClick={onBack} variant="outline" className="w-full">
          Go Back
        </Button>
      </div>
    );
  }

  const syncEmailFieldError = (field: InverterFieldConfig, value: string) => {
    if (field.kind !== "email") return;
    const error = getSolarmanEmailError(value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (error) next[field.id] = error;
      else delete next[field.id];
      return next;
    });
  };

  const isFieldValid = (f: InverterFieldConfig, i: number): boolean => {
    const val = (values[i] ?? "").trim();
    if (f.optional && !val) return true;
    if (!val) return false;
    if (f.kind === "email") return !getSolarmanEmailError(val);
    return true;
  };

  const fieldsValid = config.fields.every((f, i) => isFieldValid(f, i));

  const canConnect = fieldsValid && !connectInverterMutation.isPending;

  const setValue = (i: number, v: string) => {
    const field = config.fields[i];
    const next = [...values];
    next[i] = v;
    setValues(next);
    syncEmailFieldError(field, v);
  };

  const handleConnect = () => {
    if (!canConnect || !user) return;

    trackEvent("Next Button Clicked", { screen_name: "Inverter Connection Details", inverter_type: inverter });

    const payload: ConnectInverterRequest = {
      brand: inverter.toUpperCase(),
    };

    const brand = inverter.toLowerCase();
    const byId = Object.fromEntries(
      config.fields.map((f, i) => [f.id, (values[i] ?? "").trim()]),
    );

    if (brand === "victron") {
      payload.victronAccessToken = byId["vrm-token"];
    } else if (brand === "growatt") {
      payload.growattApiToken = byId["growatt-token"];
    } else if (brand === "sunsynk" || brand === "deye") {
      const prefix = brand === "sunsynk" ? "sunsynk" : "deye";
      payload.solarmanEmail = byId[`${prefix}-email`];
      payload.solarmanPassword = byId[`${prefix}-password`];
      if (byId[`${prefix}-plant`]) {
        payload.solarmanPlantId = byId[`${prefix}-plant`];
      }
    } else if (brand === "sandbox") {
      payload.sandboxAccessToken = byId["sandbox-token"];
    }

    connectInverterMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {config.fields.map((f, i) =>
          f.kind === "email" ? (
            <AuthInput
              key={f.id}
              label={f.label}
              id={f.id}
              type="email"
              placeholder={f.placeholder}
              value={values[i]}
              onChange={(e) => setValue(i, e.target.value)}
              onBlur={(e) => syncEmailFieldError(f, e.target.value)}
              error={fieldErrors[f.id]}
              statusColor={fieldErrors[f.id] ? "red" : undefined}
              autoComplete="email"
              className="h-14 rounded-lg border-[#D8DBE299] bg-[#FCFCFC] text-base placeholder:text-[#9CA3AF] focus-within:bg-white lg:text-lg"
            />
          ) : (
            <div key={f.id} className="space-y-2">
              <Label
                htmlFor={f.id}
                className="text-base font-medium text-dark-text lg:text-lg"
              >
                {f.label}
              </Label>
              {f.kind === "password" ? (
                <PasswordInput
                  id={f.id}
                  placeholder={f.placeholder}
                  value={values[i]}
                  onChange={(e) => setValue(i, e.target.value)}
                />
              ) : (
                <Input
                  id={f.id}
                  type={f.kind}
                  placeholder={f.placeholder}
                  value={values[i]}
                  onChange={(e) => setValue(i, e.target.value)}
                  className="h-14 rounded-lg border-[#D8DBE299] bg-[#FCFCFC] text-base placeholder:text-[#9CA3AF] focus-within:bg-white lg:text-lg"
                />
              )}
            </div>
          ),
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            trackEvent("Back Button Clicked", { screen_name: "Inverter Connection Details" });
            onBack();
          }}
          disabled={connectInverterMutation.isPending}
          className="h-14 cursor-pointer rounded-lg border-[#E5E7EB] bg-white text-base font-medium text-dark-text hover:bg-[#F9FAFB]"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleConnect}
          disabled={!canConnect}
          className={cn(
            "h-14 rounded-lg text-base font-medium lg:text-lg transition-all",
            canConnect
              ? "bg-secondary text-white hover:bg-secondary/90"
              : "bg-[#E5E7EB] text-dark-text hover:bg-[#D1D5DB] disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-[#2A2F3C] disabled:opacity-100",
          )}
        >
          {connectInverterMutation.isPending
            ? "Connecting..."
            : config.connectLabel}
        </Button>
      </div>

      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setHelperOpen((o) => !o)}
          className="cursor-pointer text-base font-medium text-[#2A2F3C] underline hover:text-[#1a1f2c] lg:text-lg"
        >
          Where do I find these?
        </button>
        {helperOpen && (
          <div className="space-y-1 text-xs text-[#6B7280] md:text-sm">
            {config.helper.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
