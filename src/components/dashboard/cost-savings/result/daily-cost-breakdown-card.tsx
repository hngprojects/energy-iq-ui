import { cn } from "@/lib/utils";
import { BreakdownTableRow } from "./primitives";

interface DailyCostBreakdownCardProps {
  activeHours: number;
  equivalentPowerKwh: number;
  generatorCostSavedNgn: number;
  generatorType?: string;
}

export function DailyCostBreakdownCard({
  activeHours,
  equivalentPowerKwh,
  generatorCostSavedNgn,
  generatorType = "PMS",
}: DailyCostBreakdownCardProps) {
  const fuelName = generatorType.toUpperCase() === "DIESEL" || generatorType.toLowerCase() === "ago" ? "AGO" : "PMS";

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        "w-full lg:max-w-139.75 lg:flex-1",
        "px-3.5 pb-5",
      )}
    >
      {/* Title */}
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Daily cost breakdown
      </h3>

      <div style={{ marginTop: "38px" }} className="flex flex-col gap-3">
        <BreakdownTableRow
          dot
          label="Total Active hours"
          value={`${activeHours.toFixed(1)} hrs`}
        />
        <BreakdownTableRow
          dot
          label="Equivalent power generated within active hours"
          value={`${equivalentPowerKwh.toFixed(1)} kWh`}
        />
        <BreakdownTableRow
          dot
          label={`Equivalent ${fuelName} generator cost saved`}
          value={`₦${Math.round(generatorCostSavedNgn).toLocaleString()}`}
        />
      </div>
    </div>
  );
}
