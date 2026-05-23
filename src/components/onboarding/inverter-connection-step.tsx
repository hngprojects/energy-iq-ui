"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";
import {
  TestConnectionStatus,
  LOADING_TOTAL_MS,
  type TestStatus,
} from "./test-connection-status";
import type { InverterType } from "./inverter-type-step";
import { INVERTER_CONFIG } from "./inverter-config";

import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { useAuthStore } from "@/stores/auth-store";
import type { ConnectInverterRequest } from "@/types/inverter";
import { trackEvent } from "@/lib/analytics";

interface InverterConnectionStepProps {
  inverter: InverterType;
  onBack: () => void;
  onConnected: () => void;
}

export function InverterConnectionStep({
  inverter,
  onBack,
  onConnected,
}: InverterConnectionStepProps) {
  const config = INVERTER_CONFIG[inverter.toLowerCase()];
  const { user } = useAuthStore();
  const { useConnectInverter } = useInverterQueries();

  const [values, setValues] = useState<string[]>(
    config?.fields.map(() => "") ?? [],
  );
  const [helperOpen, setHelperOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");

  useEffect(() => {
    trackEvent("Screen View", { screen_name: "Inverter Connection Details", inverter_type: inverter });
  }, [inverter]);

  const connectInverterMutation = useConnectInverter(onConnected);

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

  const requiredFilled = config.fields.every(
    (f, i) => f.optional || (values[i] && values[i].trim().length > 0),
  );
  const canConnect =
    requiredFilled &&
    testStatus === "success" &&
    !connectInverterMutation.isPending;

  const setValue = (i: number, v: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (testStatus !== "loading") setTestStatus("idle");
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

    connectInverterMutation.mutate(payload, {
      onError: () => setTestStatus("error"),
    });
  };

  const runTest = () => {
    if (!requiredFilled) return;
    setTestStatus("loading");
    window.setTimeout(() => {
      const ok = config.fields.every((f, i) => {
        if (f.optional) return true;
        const val = values[i] || "";
        if (f.kind === "email") return val.includes("@");
        if (f.id.includes("token")) return val.length >= 10;
        return val.length >= 4;
      });
      setTestStatus(ok ? "success" : "error");
    }, LOADING_TOTAL_MS);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {config.fields.map((f, i) => (
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
        ))}
      </div>

      {requiredFilled && (
        <TestConnectionStatus
          inverterName={config.name}
          status={testStatus}
          onRun={runTest}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            trackEvent("Back Button Clicked", { screen_name: "Inverter Connection Details" });
            onBack();
          }}
          className="h-14 cursor-pointer rounded-lg border-[#E5E7EB] bg-white text-base font-medium text-dark-text hover:bg-[#F9FAFB]"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleConnect}
          disabled={!canConnect}
          className="h-14 rounded-lg bg-[#E5E7EB] text-base font-medium text-dark-text hover:bg-[#D1D5DB] disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-[#2A2F3C] disabled:opacity-100 lg:text-lg"
        >
          {connectInverterMutation.isPending ? "Connecting..." : config.connectLabel}
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
