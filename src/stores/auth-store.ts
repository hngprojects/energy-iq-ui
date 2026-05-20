import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

const SESSION_COOKIE = "auth_session";

function setSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
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
  setAuth: (user: User, token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setTempEmail: (email: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      tempEmail: null,
      setAuth: (user, token, refreshToken) => {
        setSessionCookie();
        set({ user, token, refreshToken, isAuthenticated: true, tempEmail: null });
      },
      setUser: (user) => set({ user }),
      setTempEmail: (email) => set({ tempEmail: email }),
      logout: () => {
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
    },
  ),
);
