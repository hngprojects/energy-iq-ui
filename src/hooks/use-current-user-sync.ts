"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthService } from "@/services/auth-service";
import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";

export function useCurrentUserSync(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const enabled = (options?.enabled ?? true) && isAuthenticated;

  const query = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => AuthService.me(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!query.data) return;

    const me = query.data;
    const currentUser = useAuthStore.getState().user;

    if (currentUser) {
      const defined = Object.fromEntries(
        Object.entries(me).filter(([, v]) => v !== undefined && v !== null),
      );
      setUser({ ...currentUser, ...defined } as User);
    } else {
      setUser(me);
    }

    const profileImagePresent = Boolean(me.profilePhoto || me.profileUrl);
    if (!profileImagePresent) {
      void (async () => {
        try {
          const personalSettings = await ProfileService.getPersonalSettings();
          if (personalSettings.profileUrl) {
            const latestUser = useAuthStore.getState().user;
            if (latestUser) {
              setUser({
                ...latestUser,
                profilePhoto: personalSettings.profileUrl,
                profileUrl: personalSettings.profileUrl,
              });
            }
          }
        } catch {
          // Ignore fallback failure; this is just a best-effort sync.
        }
      })();
    }
  }, [query.data, setUser]);

  return query;
}
