"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SuperAdminAuthState {
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: () => void;
  logout: () => void;
  setHydrated: (value: boolean) => void;
}

export const useSuperAdminAuthStore = create<SuperAdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      _hasHydrated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      setHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "super-admin-auth",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
