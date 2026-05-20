import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiError } from "./error";
// import { env as serverEnv } from "@/env/server";
import { useAuthStore } from "@/stores/auth-store";

const isAbsoluteUrl = (path: string): boolean => /^https?:\/\//i.test(path);
const isInternalApiPath = (path: string): boolean => path.startsWith("/api/");
const isServer = typeof window === "undefined";

function getBaseUrl(): string | undefined {
  return isServer
    ? process.env.API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL || "/api/proxy";
}

const normalizeBackendPath = (path: string): string => {
  const base = getBaseUrl() || "http://localhost:3000";
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
};

const resolveRequestUrl = (path: string, proxy?: boolean): string => {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  // On the server, hit the backend directly instead of through the proxy
  if (proxy && !isServer) {
    const normalizedPath = path.replace(/^\/+/, "");
    return `/api/proxy/${normalizedPath}`;
  }

  if (isInternalApiPath(path)) {
    // On the server, internal API paths need the full origin
    if (isServer) {
      const host = getBaseUrl() || "http://localhost:3000";
      return `${host}${path}`;
    }
    return path;
  }

  if (!getBaseUrl()) {
    throw new Error("API_BASE_URL is not defined");
  }

  return normalizeBackendPath(path);
};

export async function apiFetch<TResponse>(
  path: string,
  config: AxiosRequestConfig = {},
  proxy?: boolean,
): Promise<TResponse> {
  const headers: Record<string, string> = {
    ...((config.headers as Record<string, string>) || {}),
  };

  // Automatically attach Authorization header if not present
  if (!headers["Authorization"]) {
    const token = !isServer ? useAuthStore.getState().token : null;

    if (token && token !== "undefined" && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const isJson =
    config.data &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof Blob);

  if (!headers["Content-Type"] && isJson) {
    headers["Content-Type"] = "application/json";
  }

  const url = resolveRequestUrl(path, proxy);
  const axiosInstance =
    proxy || isInternalApiPath(url) || !isServer
      ? axios
      : axios.create({
          baseURL: getBaseUrl(),
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 400,
        });

  try {
    const res = await axiosInstance.request({
      url,
      ...config,
      headers,
    });

    if (res.status === 204) {
      return undefined as TResponse;
    }

    if (
      res.data &&
      typeof res.data === "object" &&
      "success" in res.data &&
      "data" in res.data
    ) {
      return res.data.data as TResponse;
    }

    return res.data as TResponse;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 500;

      const AUTH_PUBLIC_PATHS = [
        "/auth/login",
        "/auth/register",
        "/auth/verify-email",
        "/auth/resend-email-otp",
        "/auth/forgot-password",
        "/auth/reset-password",
      ];
      const isPublicAuthPath = AUTH_PUBLIC_PATHS.some((p) => path.includes(p));

      if (status === 401 && typeof window !== "undefined" && !isPublicAuthPath) {
        // Clear auth tokens via Zustand on 401
        useAuthStore.getState().logout();
        window.location.replace("/login");
      }

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred. Please try again.";
      throw new ApiError(message, status, err.response?.data);
    }
    throw new ApiError(
      err instanceof Error ? err.message : "An error occurred.",
      500,
    );
  }
}
