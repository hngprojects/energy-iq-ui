"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { savingsSetupStorage } from "@/lib/savings-setup-storage";
import { useAuthStore } from "@/stores/auth-store";
import type { SavingsSetupPreferences } from "@/types/savings-setup";

interface SavingsSetupContextValue {
  preferences: SavingsSetupPreferences | null;
  isSetupComplete: boolean;
  isModalOpen: boolean;
  openSetup: () => void;
  closeSetup: () => void;
  savePreferences: (prefs: SavingsSetupPreferences) => void;
  skipSetup: () => void;
}

const SavingsSetupContext = createContext<SavingsSetupContextValue | null>(
  null,
);

export function SavingsSetupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = useAuthStore((s) => s.user?.id);
  const [preferences, setPreferences] = useState<SavingsSetupPreferences | null>(
    () => savingsSetupStorage.get(userId),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const savePreferences = useCallback(
    (prefs: SavingsSetupPreferences) => {
      savingsSetupStorage.save(prefs, userId);
      setPreferences(prefs);
      setIsModalOpen(false);
    },
    [userId],
  );

  const skipSetup = useCallback(() => {
    const skipped: SavingsSetupPreferences = {
      skipped: true,
      updatedAt: new Date().toISOString(),
    };
    savingsSetupStorage.save(skipped, userId);
    setPreferences(skipped);
    setIsModalOpen(false);
  }, [userId]);

  const value = useMemo(
    () => ({
      preferences,
      isSetupComplete: Boolean(preferences?.updatedAt),
      isModalOpen,
      openSetup: () => setIsModalOpen(true),
      closeSetup: () => setIsModalOpen(false),
      savePreferences,
      skipSetup,
    }),
    [preferences, isModalOpen, savePreferences, skipSetup],
  );

  return (
    <SavingsSetupContext.Provider value={value}>
      {children}
    </SavingsSetupContext.Provider>
  );
}

export function useSavingsSetup() {
  const ctx = useContext(SavingsSetupContext);
  if (!ctx) {
    throw new Error("useSavingsSetup must be used inside SavingsSetupProvider");
  }
  return ctx;
}
