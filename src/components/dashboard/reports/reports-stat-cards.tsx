import { reportStatsMock } from "@/lib/mocks/reports-data";
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
}

function StatCard({
  Icon,
  iconColor,
  label,
  mobileLabel,
  value,
  sub,
  showTrend,
}: StatCardProps) {
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

export function ReportStatCards() {
  const s = reportStatsMock;
  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        Icon={Sun}
        iconColor="text-[#EAB308]"
        label={s.solarGenerated.label}
        mobileLabel="Generated"
        value={s.solarGenerated.value}
        sub={s.solarGenerated.sub}
        showTrend
      />
      <StatCard
        Icon={FileCheck}
        iconColor="text-[#111827]"
        label={s.reportsSent.label}
        value={s.reportsSent.value}
        sub={s.reportsSent.sub}
      />
      <StatCard
        Icon={BatteryPlus}
        iconColor="text-[#057A55]"
        label={s.batteryEfficiency.label}
        mobileLabel="Bat. Efficiency"
        value={s.batteryEfficiency.value}
        sub={s.batteryEfficiency.sub}
        showTrend
      />
      <StatCard
        Icon={AlertTriangle}
        iconColor="text-[#DC2626]"
        label={s.reportsResolved.label}
        mobileLabel="Resolved"
        value={s.reportsResolved.value}
        sub={s.reportsResolved.sub}
      />
    </div>
  );
}
