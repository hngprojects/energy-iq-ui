import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InverterAccess, User } from "@/types/auth";

const SESSION_COOKIE = "auth_session";
const AUTH_STORAGE_KEY = "auth-storage";
const SESSION_ID_STORAGE_KEY = "session_id";

function setSessionCookie(persist = false) {
  if (typeof document === "undefined") return;
  const maxAge = persist ? "; Max-Age=2592000" : "";
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax${maxAge}${secure}`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
}

function hasIncomingOAuthToken(): boolean {
  if (typeof window === "undefined") return false;

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);

  return Boolean(
    hashParams.get("token") ||
      hashParams.get("accessToken") ||
      searchParams.get("token") ||
      searchParams.get("accessToken"),
  );
}

function getStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_ID_STORAGE_KEY);
}

function setStoredSessionId(sessionId: string | null) {
  if (typeof window === "undefined") return;

  if (sessionId) {
    localStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
    return;
  }

  localStorage.removeItem(SESSION_ID_STORAGE_KEY);
}

function wipePersistedAuthSnapshot() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("remember_me");
  localStorage.removeItem(SESSION_ID_STORAGE_KEY);
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  inverterAccess: InverterAccess[];
  isAuthenticated: boolean;
  tempEmail: string | null;
  _hasHydrated: boolean;
  setAuth: (payload: {
    user: User;
    accessToken: string;
    sessionId: string;
    inverterAccess?: InverterAccess[];
    refreshToken?: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  setAuthLocal: (payload: {
    user: User;
    accessToken: string;
    sessionId: string;
    inverterAccess?: InverterAccess[];
    refreshToken?: string;
    rememberMe?: boolean;
  }) => void;
  setTokensLocal: (accessToken: string, refreshToken?: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  setUser: (user: User) => void;
  setInverterAccess: (inverterAccess: InverterAccess[]) => void;
  setTempEmail: (email: string | null) => void;
  clearClientAuth: () => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

function normalizeUser(user: User | null): User | null {
  if (!user) return null;

  const rawUser = user as unknown as Record<string, unknown>;
  const toNonEmptyString = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value : undefined;

  const normalized: User = {
    ...user,
    profilePhoto:
      toNonEmptyString(user.profilePhoto) ??
      toNonEmptyString(rawUser.profileUrl),
    profileUrl:
      toNonEmptyString(user.profileUrl) ??
      toNonEmptyString(rawUser.profilePhoto),
    emailVerified:
      user.emailVerified ??
      (typeof rawUser.isEmailVerified === "boolean"
        ? rawUser.isEmailVerified
        : undefined),
    isEmailVerified:
      user.isEmailVerified ??
      (typeof rawUser.emailVerified === "boolean"
        ? rawUser.emailVerified
        : undefined),
  };

  if ("AiLanguage" in rawUser && typeof rawUser.AiLanguage === "string") {
    normalized.aiLanguage = normalized.aiLanguage ?? rawUser.AiLanguage;
  }

  return normalized;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      sessionId: null,
      inverterAccess: [],
      isAuthenticated: false,
      tempEmail: null,
      _hasHydrated: false,
      setAuthLocal: ({
        user,
        accessToken,
        sessionId,
        inverterAccess = [],
        refreshToken = null,
        rememberMe = false,
      }) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("session_active", "1");
          if (rememberMe) {
            localStorage.setItem("remember_me", "1");
          } else {
            localStorage.removeItem("remember_me");
          }
        }

        setStoredSessionId(sessionId);
        setSessionCookie(rememberMe);
        set({
          user: normalizeUser(user),
          token: accessToken,
          refreshToken,
          sessionId,
          inverterAccess,
          isAuthenticated: true,
          tempEmail: null,
        });
      },
      setAuth: async (payload) => {
        if (typeof window !== "undefined" && payload.refreshToken) {
          const response = await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ refreshToken: payload.refreshToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to initialize auth session.");
          }
        }

        useAuthStore.getState().setAuthLocal(payload);
      },
      setTokensLocal: (accessToken, refreshToken = null) => {
        set({ token: accessToken, refreshToken });
      },
      setSessionId: (sessionId) => {
        setStoredSessionId(sessionId);
        set({ sessionId });
      },
      setUser: (user) => set({ user: normalizeUser(user) }),
      setInverterAccess: (inverterAccess) => set({ inverterAccess }),
      setTempEmail: (email) => set({ tempEmail: email }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      clearClientAuth: () => {
        wipePersistedAuthSnapshot();
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("session_active");
        }
        clearSessionCookie();
        set({
          user: null,
          token: null,
          refreshToken: null,
          sessionId: null,
          inverterAccess: [],
          isAuthenticated: false,
          tempEmail: null,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("session_active");
          localStorage.removeItem("remember_me");
        }
        clearSessionCookie();
        setStoredSessionId(null);
        if (typeof window !== "undefined") {
          void fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ clear: true }),
          }).catch(() => undefined);
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          sessionId: null,
          inverterAccess: [],
          isAuthenticated: false,
          tempEmail: null,
        });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        sessionId: state.sessionId,
        inverterAccess: state.inverterAccess,
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
          sessionId: persisted.sessionId ?? getStoredSessionId(),
          inverterAccess: persisted.inverterAccess ?? [],
        };
      },
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined" || !state) return;

        if (hasIncomingOAuthToken()) {
          wipePersistedAuthSnapshot();
          clearSessionCookie();
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.sessionId = null;
          state.inverterAccess = [];
          state.isAuthenticated = false;
          state.tempEmail = null;
          state.setHasHydrated(true);
          return;
        }

        if (state.user) {
          state.user = normalizeUser(state.user);
        }

        state.sessionId = state.sessionId ?? getStoredSessionId();

        const rememberMe = localStorage.getItem("remember_me") === "1";
        const sessionActive = sessionStorage.getItem("session_active") === "1";

        if (state.isAuthenticated && !rememberMe && !sessionActive) {
          state.clearClientAuth();
        } else if (state.isAuthenticated || state.sessionId) {
          setSessionCookie(rememberMe);
        }

        state.setHasHydrated(true);
      },
    },
  ),
);
