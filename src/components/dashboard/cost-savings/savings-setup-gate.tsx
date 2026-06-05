"use client";

import { useEffect, useState } from "react";

import { savingsSetupStorage } from "@/lib/savings-setup-storage";
import { useAuthStore } from "@/stores/auth-store";
import { SavingsSetupModal } from "./savings-setup-modal";
import { useSavingsSetup } from "./savings-setup-context";

const SESSION_DISMISS_KEY = "energy_iq_savings_setup_dismissed";

/**
 * Mount on the Cost & Savings page only — auto-opens the setup modal on first visit.
 */
export function SavingsSetupGate() {
  const userId = useAuthStore((s) => s.user?.id);
  const { openSetup } = useSavingsSetup();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedThisSession =
      sessionStorage.getItem(SESSION_DISMISS_KEY) === "1";

    if (
      !dismissedThisSession &&
      !savingsSetupStorage.hasCompletedSetup(userId)
    ) {
      openSetup();
    }

    setChecked(true);
  }, [userId, openSetup]);

  if (!checked) return null;

  return <SavingsSetupModal onDismissSession={() => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
  }} />;
}
