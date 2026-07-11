"use client";

import { useCallback, useEffect, useRef } from "react";
import { refreshAuthSession } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth-store";

const REFRESH_BUFFER_MS = 60_000;
const MAX_SKEW_MS = 5_000;

function decodeJwtPayload(token: string): { exp?: number } | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload =
      typeof window !== "undefined"
        ? window.atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(payload) as { exp?: number };
  } catch {
    return null;
  }
}

function getTokenExpiryMs(token: string | null): number | null {
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload?.exp ? payload.exp * 1000 : null;
}

export function AuthRefreshManager() {
  const token = useAuthStore((state) => state.token);
  const sessionId = useAuthStore((state) => state.sessionId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const timerRef = useRef<number | null>(null);
  const refreshingRef = useRef(false);

  const triggerRefresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;

    try {
      const result = await refreshAuthSession();
      if (!result.ok) {
        console.debug("[AuthRefreshManager] refresh failed", result);
      }
    } finally {
      refreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isAuthenticated || !sessionId || !token) {
      return;
    }

    const expMs = getTokenExpiryMs(token);
    if (!expMs) {
      return;
    }

    const delay = Math.max(expMs - Date.now() - REFRESH_BUFFER_MS, 10_000);
    timerRef.current = window.setTimeout(() => {
      void triggerRefresh();
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, sessionId, token, triggerRefresh]);

  useEffect(() => {
    if (!isAuthenticated || !sessionId || !token) return;

    const refreshOnResume = () => {
      const expMs = getTokenExpiryMs(token);
      if (!expMs) return;

      const timeLeft = expMs - Date.now();
      if (timeLeft > REFRESH_BUFFER_MS + MAX_SKEW_MS) return;
      void triggerRefresh();
    };

    window.addEventListener("focus", refreshOnResume);
    document.addEventListener("visibilitychange", refreshOnResume);

    return () => {
      window.removeEventListener("focus", refreshOnResume);
      document.removeEventListener("visibilitychange", refreshOnResume);
    };
  }, [isAuthenticated, sessionId, token, triggerRefresh]);

  return null;
}
