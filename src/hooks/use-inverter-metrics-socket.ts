"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth-store";
import type {
  DashboardMetrics,
  EnergyUsageResponse,
  PowerConsumptionResponse,
} from "@/types/inverter";

type MetricsPayload<T> =
  | T
  | {
      inverterId?: string;
      period?: string;
      data?: T;
    };

function getSocketUrl() {
  return process.env.NEXT_PUBLIC_INVERTER_SOCKET_URL;
}

function withBearer(token: string) {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function unwrapPayload<T>(payload: MetricsPayload<T>): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data
  ) {
    return payload.data as T;
  }

  return payload as T;
}

export function useInverterMetricsSocket(
  inverterId: string | undefined,
  period: string,
) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    const socketUrl = getSocketUrl();
    if (!socketUrl || !inverterId || !token) return;

    const socket: Socket = io(socketUrl, {
      auth: {
        token: withBearer(token),
        Authorization: withBearer(token),
      },
      query: {
        inverterId,
        userId,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const subscriptionPayload = { inverterId, period };

    const subscribe = () => {
      socket.emit("join_inverter_metrics", subscriptionPayload);
      socket.emit("subscribe_inverter_metrics", subscriptionPayload);
    };

    const updateDashboardMetrics = (
      payload: MetricsPayload<DashboardMetrics>,
    ) => {
      queryClient.setQueryData(
        ["dashboard-metrics", inverterId],
        unwrapPayload(payload),
      );
    };

    const updateEnergyUsage = (
      payload: MetricsPayload<EnergyUsageResponse>,
    ) => {
      queryClient.setQueryData(
        ["energy-usage", inverterId, period],
        unwrapPayload(payload),
      );
    };

    const updatePowerConsumption = (
      payload: MetricsPayload<PowerConsumptionResponse>,
    ) => {
      queryClient.setQueryData(
        ["power-consumption", inverterId],
        unwrapPayload(payload),
      );
    };

    socket.on("connect", subscribe);
    socket.on("dashboard_metrics", updateDashboardMetrics);
    socket.on("inverter_dashboard_metrics", updateDashboardMetrics);
    socket.on("energy_usage", updateEnergyUsage);
    socket.on("inverter_energy_usage", updateEnergyUsage);
    socket.on("power_consumption", updatePowerConsumption);
    socket.on("inverter_power_consumption", updatePowerConsumption);

    return () => {
      socket.emit("leave_inverter_metrics", subscriptionPayload);
      socket.emit("unsubscribe_inverter_metrics", subscriptionPayload);
      socket.off("connect", subscribe);
      socket.off("dashboard_metrics", updateDashboardMetrics);
      socket.off("inverter_dashboard_metrics", updateDashboardMetrics);
      socket.off("energy_usage", updateEnergyUsage);
      socket.off("inverter_energy_usage", updateEnergyUsage);
      socket.off("power_consumption", updatePowerConsumption);
      socket.off("inverter_power_consumption", updatePowerConsumption);
      socket.disconnect();
    };
  }, [inverterId, period, queryClient, token, userId]);
}
