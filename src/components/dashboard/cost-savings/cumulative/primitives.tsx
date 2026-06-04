import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TrackerBadgeProps =
  | {
      badge: string;
      badgeBg: string;
      badgeColor: string;
    }
  | {
      badge?: undefined;
      badgeBg?: undefined;
      badgeColor?: undefined;
    };

export interface TrackerCardData extends TrackerBadgeProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
}

export interface TrendCardData {
  label: string;
  value: string;
  change: string;
  description: string;
}

export function TrackerCard({
  icon: Icon,
  iconColor,
  iconBg,
  badge,
  badgeBg,
  badgeColor,
  label,
  value,
}: TrackerCardData) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card border-amber-50",
        "min-w-0 overflow-hidden pb-4",
      )}
    >
      <div className="flex items-center justify-between mt-3 ml-4 mr-4">
        <div
          className="flex items-center justify-center shrink-0 rounded-md w-9 h-9 p-2"
          style={{ backgroundColor: iconBg }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: iconColor }}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        {badge && (
          <span
            className="text-[12px] font-medium leading-none whitespace-nowrap shrink-0 rounded-[9px] py-1 px-2"
            style={{
              backgroundColor: badgeBg,
              color: badgeColor,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <p
        className="text-[24px] sm:text-[28px] lg:text-[28px] font-bold leading-none tracking-tight truncate ml-4 mt-3 text-foreground"
        style={{ letterSpacing: "-0.01em" }}
      >
        {value}
      </p>

      <p className="text-[11px] font-medium leading-none tracking-wide truncate ml-4 mt-1.5 text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function TrendCard({ label, value, change, description }: TrendCardData) {
  return (
    <div
      className="rounded-lg border bg-card min-w-0 overflow-hidden p-4 sm:p-6 lg:p-6 border-amber-80"
      style={{
        minHeight: "132px",
      }}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[14px] font-normal leading-none truncate text-slate-80">
            {label}
          </span>
          <TrendingUp
            className="shrink-0 w-5 h-3 text-battery-full"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <p className="text-[24px] font-semibold leading-[28.8px] tracking-normal truncate mt-1 text-foreground">
          {value}
        </p>

        <p className="text-[12px] font-bold leading-4 truncate mt-1 text-battery-full">
          {change}
        </p>

        <p className="text-[12px] font-medium leading-none truncate text-slate-80">
          {description}
        </p>
      </div>
    </div>
  );
}
