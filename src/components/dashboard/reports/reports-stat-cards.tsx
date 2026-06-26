"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { reportsService } from "@/services/reports-service";
import { FileText, Sun, AlertTriangle, Cpu, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_STAT_CARD_ICON_COLORS } from "@/constants/reports";

interface StatCardProps {
  Icon: LucideIcon;
  iconColor: string;
  label: string;
  mobileLabel?: string;
  value: string;
  sub: string;
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
  isLoading,
}: StatCardProps) {
  if (isLoading) return <StatCardSkeleton />;

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
        <p className="text-muted-foreground truncate text-[12px] font-medium leading-4.5 sm:mt-2 sm:text-sm sm:font-normal sm:leading-normal">
          {sub}
        </p>
      </div>
    </div>
  );
}

export function ReportStatCards() {
  const { isAuthenticated } = useAuthStore();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsService.getReports(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const weeklyCount = reports?.filter((r) => r.period === "weekly").length ?? 0;
  const monthlyCount = reports?.filter((r) => r.period === "monthly").length ?? 0;
  const periodicTotal = weeklyCount + monthlyCount;

  const solarCount = reports?.filter((r) => r.type === "SOLAR").length ?? 0;
  const alertCount = reports?.filter((r) => r.type === "ALERT").length ?? 0;
  const deviceCount = reports?.filter((r) => r.type === "COSTS_AND_SAVINGS").length ?? 0;

  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        Icon={FileText}
        iconColor={REPORT_STAT_CARD_ICON_COLORS.periodic}
        label="Weekly / Monthly"
        mobileLabel="Wk / Mo"
        value={String(periodicTotal)}
        sub={`${weeklyCount} weekly, ${monthlyCount} monthly`}
        isLoading={isLoading}
      />
      <StatCard
        Icon={Sun}
        iconColor={REPORT_STAT_CARD_ICON_COLORS.solar}
        label="Solar"
        value={String(solarCount)}
        sub="Solar reports"
        isLoading={isLoading}
      />
      <StatCard
        Icon={AlertTriangle}
        iconColor={REPORT_STAT_CARD_ICON_COLORS.alert}
        label="Alerts"
        value={String(alertCount)}
        sub="Alert reports"
        isLoading={isLoading}
      />
      <StatCard
        Icon={Cpu}
        iconColor={REPORT_STAT_CARD_ICON_COLORS.device}
        label="Device"
        value={String(deviceCount)}
        sub="Device reports"
        isLoading={isLoading}
      />
    </div>
  );
}
