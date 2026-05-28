"use client";

import { useState } from "react";
import { Sun, Zap, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { AlertBanner } from "@/components/dashboard/cards/alert-banner";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { BatteryCard } from "@/components/dashboard/cards/battery-card";
import {
  SavedTodayCard,
  SavedMonthCard,
} from "@/components/dashboard/cards/savings-card";
import { PowerUsageCard } from "@/components/dashboard/cards/power-usage-card";
import {
  EnergyUsageChart,
  type Period,
  type ChartRow,
} from "@/components/dashboard/charts/energy-usage-chart";
import { AIAssistantBanner } from "@/components/dashboard/ai/ai-assistant-banner";
import { dashboardMock as d } from "@/lib/mocks/dashboard-data";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getLast6Months(): { months: string[]; active: string } {
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(names[m.getMonth()]);
  }
  return { months, active: names[now.getMonth()] };
}

function formatChartLabel(dateStr: string, period: Period): string {
  const date = new Date(dateStr);
  if (period === "Hourly") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  }
  if (period === "Monthly") {
    return date.toLocaleDateString("en-US", { month: "short" });
  }
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatDataAge(seconds: number): string {
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function CardSkeleton() {
  return (
    <div className="border-border bg-card animate-pulse rounded-2xl border p-5 space-y-3">
      <div className="bg-muted h-4 w-24 rounded" />
      <div className="bg-muted h-8 w-32 rounded" />
      <div className="bg-muted h-3 w-40 rounded" />
      <div className="bg-muted h-6 w-24 rounded-full" />
    </div>
  );
}

function MetricRowSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function SavingsRowSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardContent() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<Period>("Daily");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedReason, setDismissedReason] = useState<string | null>(null);
  const { months, active } = getLast6Months();

  const {
    useUserInverters,
    useDashboardMetrics,
    useEnergyUsage,
    usePowerConsumption,
  } = useInverterQueries();

  const { data: inverters, isLoading: invertersLoading } = useUserInverters();
  const inverterId = inverters?.[0]?.id;

  const {
    data: metrics,
    isLoading: metricsLoading,
    dataUpdatedAt,
    refetch: refetchMetrics,
  } = useDashboardMetrics(inverterId);

  const {
    data: energyUsage,
    isLoading: energyLoading,
    refetch: refetchEnergy,
  } = useEnergyUsage(inverterId, period.toLowerCase());

  const { data: powerConsumption, refetch: refetchPower } =
    usePowerConsumption(inverterId);

  const isLoadingCards = invertersLoading || metricsLoading;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setDismissedReason(null);
    await Promise.allSettled([
      refetchMetrics(),
      refetchEnergy(),
      refetchPower(),
    ]);
    setIsRefreshing(false);
  };

  const chartData: ChartRow[] = Array.isArray(energyUsage?.data)
    ? energyUsage.data.map((p) => ({
        day: p?.date ? formatChartLabel(p.date, period) : "",
        generated: p?.solarKwh ?? 0,
        used: p?.avgLoadKw ?? 0,
      }))
    : d.weekly;

  const zones = Array.isArray(powerConsumption?.zones)
    ? powerConsumption.zones.map((z) => ({
        name: z.name,
        pct: z.percentage,
        watts: z.watts,
      }))
    : d.zones;

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : d.status.updated;

  const isOnline = metrics && !metrics.systemOffline;

  const alertReason =
    metrics && metrics.health.status !== "GREEN" ? metrics.health.reason : null;
  const alertVariant = metrics?.health.status === "RED" ? "danger" : "warning";
  const showAlert = !!alertReason && alertReason !== dismissedReason;

  const solarSub = metrics
    ? `Updated ${formatDataAge(metrics.dataAgeSeconds)}`
    : undefined;

  const runningSub = metrics?.currentReadings
    ? `Grid: ${metrics.currentReadings.gridVoltageV}V · Battery: ${metrics.currentReadings.batteryVoltageV}V`
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
            {getGreeting()}, {user?.firstName ?? d.user.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your system has been running on solar for 6 hrs today
          </p>
        </div>

        <div className="flex items-center gap-2 self-start text-xs bg-white border border-[#EDEDED] py-1 px-2 rounded-[10px]">
          {isOnline && (
            <>
              <span className="bg-success-alt/50 h-2 w-2 rounded-full" />
              <span className="text-success-alt font-medium">
                All systems working fine
              </span>
              <span className="text-muted-foreground">·</span>
            </>
          )}
          <span className="text-muted-foreground">{lastUpdated}</span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh"
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors disabled:pointer-events-none"
          >
            <RefreshCw
              className={cn(
                "h-3 w-3 transition-transform duration-500",
                isRefreshing && "animate-spin",
              )}
            />
          </button>
        </div>
      </div>

      {showAlert && (
        <AlertBanner
          message={alertReason!}
          variant={alertVariant}
          onDismiss={() => setDismissedReason(alertReason)}
        />
      )}

      {/* Metric cards */}
      {isLoadingCards ? (
        <MetricRowSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            icon={Sun}
            label="Solar Input"
            value={metrics?.currentReadings?.solarKw ?? d.solar.value}
            unit="kW"
            sub={solarSub}
            pill={
              isOnline && (metrics?.currentReadings?.solarKw ?? 0) > 0
                ? "Generating"
                : undefined
            }
          />
          <BatteryCard
            percent={
              metrics?.currentReadings?.batterySocPercent ?? d.battery.percent
            }
          />
          <MetricCard
            icon={Zap}
            iconClass="text-success-alt/70"
            label="Running now"
            value={metrics?.currentReadings?.loadKw ?? d.running.value}
            unit="kW"
            sub={runningSub}
            pill={
              metrics
                ? metrics.systemOffline
                  ? "Offline"
                  : "Active"
                : d.running.note
            }
            pillTone="muted"
          />
        </div>
      )}

      {/* Savings + power usage */}
      {isLoadingCards ? (
        <SavingsRowSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SavedMonthCard
            amount={metrics?.nairaSavedThisMonth ?? d.savedMonth.amount}
            months={months}
            active={active}
          />
          <SavedTodayCard
            amount={metrics?.nairaSavedToday ?? d.savedToday.amount}
          />
          <PowerUsageCard zones={zones} />
        </div>
      )}

      {/* Energy usage chart */}
      <EnergyUsageChart
        data={chartData}
        period={period}
        onPeriodChange={setPeriod}
        isLoading={!!inverterId && energyLoading}
      />

      <AIAssistantBanner />
    </div>
  );
}

