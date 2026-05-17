import { ArrowUpRight, ArrowDown, ArrowUp } from "lucide-react";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

export function SavedTodayCard({
  amount,
  diesel,
  deltaPct,
}: {
  amount: number;
  diesel: number;
  deltaPct: number;
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
      <p className="text-muted-foreground text-sm">You saved today</p>
      <p className="text-3xl font-bold tracking-tight">{fmt(amount)}</p>
      <p className="text-muted-foreground text-xs leading-relaxed">
        That&apos;s
        <span className="text-foreground font-medium">{fmt(diesel)}</span> in
        diesel you didn&apos;t need to burn today
      </p>
      <span className="bg-chart-battery/10 text-chart-battery inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
        <ArrowUp className="h-3 w-3" /> {deltaPct}% more than yesterday
      </span>
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
  deltaPct: number;
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
      <span className="bg-danger/10 text-danger inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
        <ArrowDown className="h-3 w-3" /> {Math.abs(deltaPct)}% vs last month
      </span>
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
