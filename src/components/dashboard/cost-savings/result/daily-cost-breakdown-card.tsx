import { cn } from "@/lib/utils";
import { BreakdownTableRow } from "./primitives";

interface DailyCostBreakdownCardProps {
  activeHours?: number | null;
  equivalentPowerKwh?: number | null;
  title?: string;
}

function formatHours(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} hrs`;
}

function formatKwh(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(1)} kWh`;
}

export function DailyCostBreakdownCard({
  activeHours,
  equivalentPowerKwh,
  title = "Daily cost breakdown",
}: DailyCostBreakdownCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card",
        "w-full min-w-0 lg:max-w-139.75 lg:flex-1",
        "px-3.5 pb-5",
      )}
    >
      <h3 className="mt-6 text-[18px] font-medium leading-snug tracking-tight text-foreground lg:text-[20px]">
        {title}
      </h3>

      <div className="mt-8 flex flex-col gap-4">
        <BreakdownTableRow
          dot
          label="Total Active hours"
          value={formatHours(activeHours)}
        />
        <BreakdownTableRow
          dot
          label="Equivalent power generated within active hours"
          value={formatKwh(equivalentPowerKwh)}
        />
      </div>
    </div>
  );
}
