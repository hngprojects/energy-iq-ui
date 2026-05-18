"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthActions() {
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();

  const logout = (callback?: () => void) => {
    logoutStore();
    callback?.();
    router.push("/");
  };

  return {
    logout,
  };
}
