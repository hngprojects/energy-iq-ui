import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FUEL_PRICE, PAYBACK_PCT } from "@/lib/mocks/cost-savings-results";


export function ProjectedPaybackCard() {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden",
        "w-full lg:flex-1",
        "px-3.5 pb-5",
      )}
      style={{ borderColor: "#7C520B", borderWidth: "1px" }}
    >
      {/* Title */}
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Projected payback period
      </h3>

      {/* Subtitle */}
      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "8px" }}
      >
        Before vs after - petrol at {FUEL_PRICE}
      </p>

      <p
        className="leading-none text-amber-70 text-[20px] lg:text-[24px] font-medium"
        style={{ letterSpacing: "-0.01em", marginTop: "20px" }}
      >
        2.3 Years
      </p>

      {/* Sub-label */}
      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "6px" }}
      >
        2 years 4 months to fully payback
      </p>

      {/* Progress bar */}
      <div
        className="w-full overflow-hidden rounded-sm"
        style={{ height: "6px", backgroundColor: "#CAD5E2", marginTop: "24px" }}
        role="progressbar"
        aria-valuenow={PAYBACK_PCT}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Payback progress"
      >
        <div
          className="h-full rounded-sm bg-amber-60"
          style={{ width: `${PAYBACK_PCT}%` }}
        />
      </div>

      {/* Labels below bar */}
      <div className="flex items-center justify-between" style={{ marginTop: "12px" }}>
        <span className="text-[12px] font-normal leading-none" style={{ color: "#666666" }}>
          {PAYBACK_PCT}% recovered
        </span>
        <span className="text-[12px] font-normal leading-none" style={{ color: "#666666" }}>
          ₦ 2,016,000 saved
        </span>
      </div>

      {/* CTA button */}
      <div style={{ marginTop: "20px" }} className="flex justify-end">
        <Button
          variant="secondary"
          size="default"
          className="h-10 gap-1.5 text-surface-20 rounded-lg w-full sm:w-auto"
        >
          Button
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
