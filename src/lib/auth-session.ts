import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import type { MeResponse, RefreshTokenResponse } from "@/types/auth";

export function resetAuthForOAuthCallback(): void {
  useAuthStore.getState().clearClientAuth();
}

function applyRefreshResponse(data: RefreshTokenResponse) {
  const { setTokensLocal } = useAuthStore.getState();
  setTokensLocal(data.accessToken, data.refreshToken ?? null);
}

function applyUserProfile(data: MeResponse) {
  const { setUser, setInverterAccess } = useAuthStore.getState();
  setUser(data.user);
  setInverterAccess(data.inverterAccess ?? []);
}

export async function refreshAuthSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const { sessionId, setSessionId } = useAuthStore.getState();
  if (!sessionId) return false;

  try {
    const response = await fetch("/api/session", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    const data = (payload?.data ?? payload) as RefreshTokenResponse | null;

    if (!data?.accessToken) {
      return false;
    }

    applyRefreshResponse(data);

    const profile = await AuthService.me();
    applyUserProfile(profile);
    setSessionId(sessionId);

    return true;
  } catch {
    return false;
  }
}
