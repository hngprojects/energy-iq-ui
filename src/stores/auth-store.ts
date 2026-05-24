import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

const SESSION_COOKIE = "auth_session";

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
  setUser: (user: User) => void;
  setTempEmail: (email: string | null) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
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
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          tempEmail: null,
        });
      },
      setUser: (user) => set({ user }),
      setTempEmail: (email) => set({ tempEmail: email }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      logout: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("session_active");
          localStorage.removeItem("remember_me");
        }
        clearSessionCookie();
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
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined" || !state) return;
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

