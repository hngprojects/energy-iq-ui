"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { InverterService } from "@/services/inverter-service";
import { alertsService } from "@/services/alerts-service";
import {
  Sun,
  FileCheck,
  BatteryPlus,
  AlertTriangle,
  MoveUp,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  Icon: LucideIcon;
  iconColor: string;
  label: string;
  mobileLabel?: string;
  value: string;
  sub: string;
  showTrend?: boolean;
  isLoading?: boolean;
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border-border flex min-w-0 items-center rounded-[8px] border p-4 sm:block sm:rounded-xl sm:p-5">
      <div className="flex min-w-0 flex-col justify-between sm:flex sm:flex-col sm:gap-2">
        <div className="flex flex-col gap-3.5 sm:block">
          <div className="flex items-center gap-1.5 sm:mb-2">
            <div className="bg-muted h-4 w-4 animate-pulse rounded" />
            <div className="bg-muted h-3.5 w-24 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-8 w-28 animate-pulse rounded" />
        </div>
        <div className="bg-muted mt-2 h-3.5 w-32 animate-pulse rounded" />
      </div>
    </div>
  );
}

function StatCard({
  Icon,
  iconColor,
  label,
  mobileLabel,
  value,
  sub,
  showTrend,
  isLoading,
}: StatCardProps) {
  if (isLoading) return <StatCardSkeleton />;

  const trendMatch = showTrend ? sub.match(/^(\d+%)(.*)$/) : null;
  const trendPercentage = trendMatch ? trendMatch[1] : "";
  const trendRest = trendMatch ? trendMatch[2] : sub;

  return (
    <div className="bg-card border-border flex min-w-0 items-center rounded-[8px] border p-4 sm:block sm:rounded-xl sm:p-5">
      <div className="flex min-w-0 flex-col justify-between sm:flex sm:flex-col sm:gap-2">
        <div className="flex flex-col gap-3.5 sm:block">
          <div className="flex items-center gap-1.5 sm:mb-2">
            <Icon className={cn("size-4", iconColor)} />
            <span className="text-muted-foreground hidden text-sm font-medium sm:inline">
              {label}
            </span>
            <span className="text-muted-foreground inline text-[13px] font-medium leading-5.25 tracking-[-1%] whitespace-nowrap sm:hidden">
              {mobileLabel || label}
            </span>
          </div>
          <p className="text-foreground text-[22px] font-semibold leading-[120%] tracking-[-2%] whitespace-nowrap sm:text-3xl sm:font-bold sm:leading-tight sm:tracking-normal">
            {value}
          </p>
        </div>
        {showTrend && trendMatch ? (
          <p className="text-muted-foreground flex items-center gap-1 text-[12px] font-medium leading-4.5 sm:mt-2 sm:text-sm sm:font-normal sm:leading-normal">
            <MoveUp className="text-positive size-3" />
            <span className="text-positive font-medium">{trendPercentage}</span>
            <span className="truncate">{trendRest}</span>
          </p>
        ) : (
          <p className="text-muted-foreground truncate text-[12px] font-medium leading-4.5 sm:mt-2 sm:text-sm sm:font-normal sm:leading-normal">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function formatKwh(kwh: number): string {
  if (kwh >= 1000) {
    return `${(kwh / 1000).toFixed(1).replace(/\.0$/, "")} MWh`;
  }
  return `${Math.round(kwh).toLocaleString()} kWh`;
}

export function ReportStatCards() {
  const { isAuthenticated } = useAuthStore();
  const { useUserInverters, useDashboardMetrics, useCumulativeSavings } = useInverterQueries();

  const { data: inverters } = useUserInverters();
  const inverterId = inverters?.[0]?.id;

  // Battery efficiency — from dashboard metrics (avg of 7-day history)
  const { data: dashMetrics, isLoading: metricsLoading } = useDashboardMetrics(inverterId);

  // Solar generated — from cumulative savings (lifetimeEnergyKwh), monthly from savings endpoint
  const { data: cumulativeData, isLoading: cumulativeLoading } = useCumulativeSavings(inverterId);

  // Monthly solar energy — from savings metrics for this month
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const { data: monthlySavings, isLoading: monthlySavingsLoading } = useQuery({
    queryKey: ["reports-monthly-savings", inverterId, monthStart, todayStr],
    queryFn: () =>
      InverterService.getSavingsMetrics(inverterId!, {
        startDate: monthStart,
        endDate: todayStr,
      }),
    enabled: isAuthenticated && !!inverterId,
    staleTime: 1000 * 60 * 5,
  });

  // Alerts resolved — from alert summary
  const { data: alertSummary, isLoading: alertsLoading } = useQuery({
    queryKey: ["alert-summary-reports"],
    queryFn: () => alertsService.getAlertSummary(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  // --- Derive values ---

  // Solar generated this month
  const solarThisMonth = monthlySavings?.summary?.totalEnergyGeneratedKwh ?? 0;
  const solarValue = solarThisMonth > 0 ? formatKwh(solarThisMonth) : "— kWh";

  // Battery efficiency — average batterySoc over last 7 days from dashboard metrics
  const history = dashMetrics?.sevenDayHistory ?? [];
  const avgBatterySoc =
    history.length > 0
      ? history.reduce((sum, d) => sum + (d.avgBatterySocPercent ?? 0), 0) / history.length
      : null;
  const batteryValue = avgBatterySoc !== null ? `${Math.round(avgBatterySoc)}%` : "—";

  // Reports Sent — no direct endpoint available
  const reportsSentValue = "12"; // no endpoint — keep mock
  const reportsSentSub = "To 5 recipients this month"; // no endpoint — keep mock

  // Reports Resolved — active vs total alerts from alert summary
  const totalAlerts = (alertSummary?.activeAlerts?.count ?? 0) + (alertSummary?.unresolved?.count ?? 0);
  const unresolvedCount = alertSummary?.unresolved?.count ?? 0;
  const resolvedCount = Math.max(0, totalAlerts - unresolvedCount);
  const resolutionRate =
    totalAlerts > 0 ? Math.round((resolvedCount / totalAlerts) * 100) : 0;
  const resolvedValue =
    alertSummary ? `${resolvedCount} / ${totalAlerts}` : "— / —";
  const resolvedSub =
    alertSummary ? `${resolutionRate}% resolution rate` : "Loading...";

  const isLoadingSolar = cumulativeLoading || monthlySavingsLoading;
  const isLoadingBattery = metricsLoading;
  const isLoadingAlerts = alertsLoading;

  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        Icon={Sun}
        iconColor="text-[#EAB308]"
        label="Solar generated"
        mobileLabel="Generated"
        value={solarValue}
        sub="This month"
        isLoading={isLoadingSolar && !solarThisMonth}
      />
      <StatCard
        Icon={FileCheck}
        iconColor="text-[#111827]"
        label="Reports Sent"
        value={reportsSentValue}
        sub={reportsSentSub}
      />
      <StatCard
        Icon={BatteryPlus}
        iconColor="text-[#057A55]"
        label="Battery Efficiency"
        mobileLabel="Bat. Efficiency"
        value={batteryValue}
        sub="Avg over last 7 days"
        isLoading={isLoadingBattery && avgBatterySoc === null}
      />
      <StatCard
        Icon={AlertTriangle}
        iconColor="text-[#DC2626]"
        label="Reports Resolved"
        mobileLabel="Resolved"
        value={resolvedValue}
        sub={resolvedSub}
        isLoading={isLoadingAlerts && !alertSummary}
      />
    </div>
  );
}
