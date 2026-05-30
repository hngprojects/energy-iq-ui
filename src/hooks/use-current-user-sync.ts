"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthService } from "@/services/auth-service";
import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types/auth";

export function useCurrentUserSync(options?: { enabled?: boolean }) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const enabled = (options?.enabled ?? true) && !!token;

  const query = useQuery({
    queryKey: ["auth-me", token],
    queryFn: async () => {
      const me = await AuthService.me();
      try {
        const settings = await ProfileService.getProfile();
        if (settings) {
          const aiLanguage = settings.aiLanguage ?? settings.AiLanguage;
          if (aiLanguage) {
            me.aiLanguage = aiLanguage;
          }
          if (settings.businessName) me.businessName = settings.businessName;
          if (settings.businessType) me.businessType = settings.businessType;
          if (settings.state) me.state = settings.state;
          if (settings.city) me.city = settings.city;
        }
      } catch (err) {
        console.error("[useCurrentUserSync] Failed to fetch personal settings:", err);
      }
      return me;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) {
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
    }
  }, [query.data, setUser]);

  return query;
}
