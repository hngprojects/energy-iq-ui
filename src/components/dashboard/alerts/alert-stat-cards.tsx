import { alertStatsMock } from "@/lib/mocks/alerts-data";
import { AlertSummaryResponse } from "@/types/alerts";

interface StatCardProps {
  dotColor: string;
  label: string;
  count: number;
  sub: string;
}

interface AlertStatCardsProps {
  data?: AlertSummaryResponse;
  isLoading?: boolean;
}

function StatCard({ dotColor, label, count, sub }: StatCardProps) {
  return (
    <div className="bg-card border-border flex flex-col gap-2 rounded-xl border p-5">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
        <span className="text-muted-foreground text-sm font-medium">
          {label}
        </span>
      </div>
      <p className="text-foreground text-3xl font-bold">{count}</p>
      <p className="text-muted-foreground text-sm">{sub}</p>
    </div>
  );
}

export function AlertStatCards({ data }: AlertStatCardsProps) {
  const s = data ?? alertStatsMock;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        dotColor="bg-chart-battery"
        label="Active Alerts"
        count={s.activeAlerts.count}
        sub={s.activeAlerts.label}
      />
      <StatCard
        dotColor="bg-destructive"
        label="Critical"
        count={s.critical.count}
        sub={s.critical.label}
      />
      <StatCard
        dotColor="bg-amber"
        label="Warning"
        count={s.warning.count}
        sub={s.warning.label}
      />
      <StatCard
        dotColor="bg-secondary"
        label="Unresolved"
        count={s.unresolved.count}
        sub={s.unresolved.label}
      />
    </div>
  );
}
