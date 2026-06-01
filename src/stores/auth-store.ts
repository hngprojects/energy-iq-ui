import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

const SESSION_COOKIE = "auth_session";
const AUTH_STORAGE_KEY = "auth-storage";

function setSessionCookie(persist = false) {
  if (typeof document === "undefined") return;
  const maxAge = persist ? "; Max-Age=2592000" : ""; // 30 days if rememberMe, else session
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax${maxAge}${secure}`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
}

function persistTokensToSession(token: string, refreshToken: string) {
  if (typeof window === "undefined") return;

  try {
    void fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, refreshToken }),
    });
  } catch {
    // ignore network errors here
  }
}

function scrubPersistedAuthStorage() {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return;

    const parsed = JSON.parse(stored) as {
      state?: Record<string, unknown>;
      version?: number;
    };
    if (!parsed.state) return;

    const safeState = { ...parsed.state };
    delete safeState.token;
    delete safeState.refreshToken;

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ ...parsed, state: safeState }),
    );
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  tempEmail: string | null;
  _hasHydrated: boolean;
  setAuth: (
    user: User,
    token: string,
    refreshToken: string,
    rememberMe?: boolean,
  ) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setTempEmail: (email: string | null) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

function normalizeUser(user: User | null): User | null {
  if (!user) return null;
  const rawUser = user as unknown as Record<string, unknown>;
  if ("AiLanguage" in rawUser && typeof rawUser.AiLanguage === "string") {
    const normalized: User = {
      ...user,
      aiLanguage: user.aiLanguage ?? rawUser.AiLanguage,
    };
    const cleaned = { ...normalized } as unknown as Record<string, unknown>;
    delete cleaned.AiLanguage;
    return cleaned as unknown as User;
  }
  return user;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      tempEmail: null,
      _hasHydrated: false,
      setAuth: (user, token, refreshToken, rememberMe = false) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("session_active", "1");
          if (rememberMe) {
            localStorage.setItem("remember_me", "1");
          } else {
            localStorage.removeItem("remember_me");
          }
        }
        setSessionCookie(rememberMe);
        // Inform the server to persist tokens as HttpOnly cookies.
        persistTokensToSession(token, refreshToken);
        set({
          user: normalizeUser(user),
          token,
          refreshToken,
          isAuthenticated: true,
          tempEmail: null,
        });
      },
      setTokens: (token, refreshToken) => {
        persistTokensToSession(token, refreshToken);
        set({ token, refreshToken });
      },
      setUser: (user) => set({ user: normalizeUser(user) }),
      setTempEmail: (email) => set({ tempEmail: email }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      logout: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("session_active");
          localStorage.removeItem("remember_me");
        }
        clearSessionCookie();
        // Also clear server-side HttpOnly token cookie
        if (typeof window !== "undefined") {
          try {
            void fetch("/api/session", { method: "DELETE" });
          } catch {
            // ignore
          }
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          tempEmail: null,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tempEmail: state.tempEmail,
      }),
      merge: (persistedState, currentState) => {
        const persisted =
          persistedState && typeof persistedState === "object"
            ? (persistedState as Partial<AuthState>)
            : {};

        return {
          ...currentState,
          ...persisted,
          token: null,
          refreshToken: null,
        };
      },
      onRehydrateStorage: () => (state) => {
        scrubPersistedAuthStorage();
        if (typeof window === "undefined" || !state) return;
        if (state.user) {
          state.user = normalizeUser(state.user);
        }
        const rememberMe = localStorage.getItem("remember_me") === "1";
        const sessionActive = sessionStorage.getItem("session_active") === "1";

        if (state.isAuthenticated && !rememberMe && !sessionActive) {
          state.logout();
        } else if (state.isAuthenticated) {
          setSessionCookie(rememberMe);
        }

        state.setHasHydrated(true);
      },
    },
  ),
);
