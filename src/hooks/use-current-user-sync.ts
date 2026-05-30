"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUserSync(options?: { enabled?: boolean }) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const enabled = (options?.enabled ?? true) && !!token;

  return useQuery({
    queryKey: ["auth-me", token],
    queryFn: async () => {
      const me = await AuthService.me();
      const currentUser = useAuthStore.getState().user;

      setUser(currentUser ? { ...currentUser, ...me } : me);
      return me;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
