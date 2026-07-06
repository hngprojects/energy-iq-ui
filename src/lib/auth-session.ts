import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import type { MeResponse, RefreshTokenResponse } from "@/types/auth";

export type RefreshSessionResult =
  | { ok: true }
  | { ok: false; status?: number; message?: string };

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

export async function refreshAuthSession(): Promise<RefreshSessionResult> {
  if (typeof window === "undefined") {
    return { ok: false, message: "Refresh is only available in the browser." };
  }

  const { sessionId, setSessionId } = useAuthStore.getState();
  if (!sessionId) {
    return { ok: false, status: 401, message: "Missing sessionId." };
  }

  try {
    const response = await fetch("/api/session", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return {
        ok: false,
        status: response.status,
        message:
          payload?.message ||
          (typeof payload?.error === "string" ? payload.error : undefined),
      };
    }

    const payload = await response.json().catch(() => null);
    const data = (payload?.data ?? payload) as RefreshTokenResponse | null;

    if (!data?.accessToken) {
      return {
        ok: false,
        status: 502,
        message: "Refresh response is missing an access token.",
      };
    }

    applyRefreshResponse(data);

    const profile = await AuthService.me();
    applyUserProfile(profile);
    setSessionId(sessionId);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Refresh failed.",
    };
  }
}
