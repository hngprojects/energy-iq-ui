import { useAuthStore } from "@/stores/auth-store";
import type { RefreshTokenResponse } from "@/types/auth";

export async function persistTokensToSession(
  token: string,
  refreshToken: string,
): Promise<void> {
  if (typeof window === "undefined") return;

  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Failed to persist auth session cookies (${response.status})`);
  }
}

function applyRefreshResponse(data: RefreshTokenResponse) {
  const { user, setAuthLocal, setTokensLocal } = useAuthStore.getState();
  const rememberMe =
    typeof window !== "undefined" &&
    localStorage.getItem("remember_me") === "1";

  if (user) {
    setAuthLocal(user, data.accessToken, data.refreshToken, rememberMe);
  } else {
    setTokensLocal(data.accessToken, data.refreshToken);
  }
}

export async function refreshAuthSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const response = await fetch("/api/session", {
      method: "PATCH",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    const data = (payload?.data ?? payload) as RefreshTokenResponse | null;

    if (!data?.accessToken || !data?.refreshToken) {
      return false;
    }

    applyRefreshResponse(data);
    return true;
  } catch {
    return false;
  }
}
