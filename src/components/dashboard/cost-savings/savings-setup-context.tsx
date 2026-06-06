"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  isSavingsSetupComplete,
  personalSettingsToPreferences,
  preferencesToPersonalSettingsPatch,
} from "@/lib/savings-personal-settings";
import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import type { SavingsSetupPreferences } from "@/types/savings-setup";

interface SavingsSetupContextValue {
  preferences: SavingsSetupPreferences | null;
  isSetupComplete: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isModalOpen: boolean;
  openSetup: () => void;
  closeSetup: () => void;
  savePreferences: (prefs: SavingsSetupPreferences) => Promise<void>;
  syncFuelPrice: (price: number) => Promise<void>;
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
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ["personal-settings", userId],
    queryFn: () => ProfileService.getPersonalSettings(),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const preferences = useMemo(
    () =>
      settingsQuery.data
        ? personalSettingsToPreferences(settingsQuery.data)
        : null,
    [settingsQuery.data],
  );

  const isSetupComplete = useMemo(
    () =>
      settingsQuery.data ? isSavingsSetupComplete(settingsQuery.data) : false,
    [settingsQuery.data],
  );

  const invalidateSavingsData = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["personal-settings"] });
    await queryClient.invalidateQueries({ queryKey: ["savings-metrics"] });
  }, [queryClient]);

  const savePreferences = useCallback(
    async (prefs: SavingsSetupPreferences) => {
      setIsSaving(true);
      try {
        await ProfileService.updateProfile(
          preferencesToPersonalSettingsPatch(prefs),
        );
        await invalidateSavingsData();
        setIsModalOpen(false);
      } finally {
        setIsSaving(false);
      }
    },
    [invalidateSavingsData],
  );

  const syncFuelPrice = useCallback(
    async (price: number) => {
      await ProfileService.updateProfile({ customFuelPriceNaira: price });
      await invalidateSavingsData();
    },
    [invalidateSavingsData],
  );

  const skipSetup = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      isSetupComplete,
      isLoading: settingsQuery.isLoading,
      isSaving,
      isModalOpen,
      openSetup: () => setIsModalOpen(true),
      closeSetup: () => setIsModalOpen(false),
      savePreferences,
      syncFuelPrice,
      skipSetup,
    }),
    [
      preferences,
      isSetupComplete,
      settingsQuery.isLoading,
      isSaving,
      isModalOpen,
      savePreferences,
      syncFuelPrice,
      skipSetup,
    ],
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
