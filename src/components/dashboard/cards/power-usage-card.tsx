import { Sun, Snowflake, Lightbulb, MoveUpRight } from "lucide-react";

const icons = [Snowflake, Snowflake, Lightbulb];

export function PowerUsageCard({
  zones,
}: {
  zones: { name: string; pct: number }[];
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Where your power&apos;s going</p>
        <span className="bg-chart-battery/10 text-chart-battery inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium">
          <span className="bg-chart-battery h-1.5 w-1.5 animate-pulse rounded-full" />
          Live
        </span>
      </div>
      <div className="space-y-3">
        {zones.map((z, i) => {
          const Icon = icons[i] ?? Sun;
          return (
            <div key={z.name} className="flex items-center gap-3">
              <Icon className="text-muted-foreground h-4 w-4" />
              <span className="flex-1 text-sm">{z.name}</span>
              <span className="text-sm font-semibold tabular-nums">
                {z.pct}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-border flex items-center justify-between border-t pt-3 text-xs">
        <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <MoveUpRight className="h-3 w-3" /> View breakdown
        </button>
        <span className="text-muted-foreground">All 5 zones</span>
      </div>
    </div>
  );
}
