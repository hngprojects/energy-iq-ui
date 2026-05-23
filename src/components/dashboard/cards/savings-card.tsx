import { ArrowUpRight, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

export function SavedTodayCard({
  amount,
  diesel,
  deltaPct,
}: {
  amount: number;
  diesel?: number;
  deltaPct?: number;
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
      <p className="text-muted-foreground text-sm">You saved today</p>
      <p className="text-3xl font-bold tracking-tight">{fmt(amount)}</p>
      {diesel != null ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          That&apos;s{" "}
          <span className="text-foreground font-medium">{fmt(diesel)}</span>
          &nbsp;in diesel you didn&apos;t need to burn today
        </p>
      ) : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          Savings accumulate as your system generates power
        </p>
      )}
      {deltaPct != null && (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            deltaPct >= 0
              ? "bg-chart-battery text-success-alt"
              : "bg-danger/10 text-danger",
          )}
        >
          {deltaPct >= 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {Math.abs(deltaPct)}% {deltaPct >= 0 ? "more" : "less"} than yesterday
        </span>
      )}
    </div>
  );
}

export function SavedMonthCard({
  amount,
  deltaPct,
  months,
  active,
}: {
  amount: number;
  deltaPct?: number;
  months: string[];
  active: string;
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
      <div className="flex items-start justify-between">
        <p className="text-muted-foreground text-sm">Saved this month</p>
        <ArrowUpRight className="text-muted-foreground h-4 w-4" />
      </div>
      <p className="text-3xl font-bold tracking-tight">{fmt(amount)}</p>
      {deltaPct != null ? (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            deltaPct >= 0
              ? "bg-chart-battery text-success-alt"
              : "bg-danger/10 text-danger",
          )}
        >
          {deltaPct >= 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {Math.abs(deltaPct)}% vs last month
        </span>
      ) : (
        <p className="text-muted-foreground text-xs">
          Monthly comparison coming soon
        </p>
      )}
      <div className="text-muted-foreground flex justify-between pt-2 text-xs">
        {months.map((m) => (
          <span
            key={m}
            className={m === active ? "text-foreground font-semibold" : ""}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
