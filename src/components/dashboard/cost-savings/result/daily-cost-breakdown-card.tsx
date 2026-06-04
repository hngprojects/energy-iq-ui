import { cn } from "@/lib/utils";
import { DAILY_LEGEND_ITEMS, FUEL_PRICE } from "@/lib/mocks/cost-savings-results";
import { LegendRow, NetSavingsRow } from "./primitives";


export function DailyCostBreakdownCard() {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-card overflow-hidden",
        "w-full lg:max-w-139.75 lg:flex-1",
        "px-3.5 pb-5",
      )}
      style={{ borderColor: "#7C520B", borderWidth: "1px" }}
    >
      {/* Title */}
      <h3
        className="leading-none tracking-tight text-[18px] lg:text-[20px] font-medium"
        style={{ color: "#141414", marginTop: "24px" }}
      >
        Daily cost breakdown
      </h3>

      {/* Subtitle */}
      <p
        className="leading-none text-[13px] lg:text-[14px] font-normal"
        style={{ color: "#666666", marginTop: "8px" }}
      >
        Before vs after - petrol at {FUEL_PRICE}
      </p>

      <div style={{ marginTop: "20px" }}>
        {/* Desktop column headers */}
        <div
          className="hidden lg:grid items-center w-full mb-3"
          style={{ gridTemplateColumns: "1fr 94px 55px 94px 55px" }}
        >
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 shrink-0" aria-hidden="true" />
          </span>
          <span />
          <span className="text-left text-[11px] font-medium leading-none text-grey">Before</span>
          <span />
          <span className="text-left text-[11px] font-medium leading-none text-grey">After</span>
        </div>

        {/* Mobile / Tablet column headers */}
        <div
          className="grid lg:hidden items-center w-full mb-3"
          style={{ gridTemplateColumns: "1fr 56px 56px", columnGap: "8px" }}
        >
          <span />
          <span className="text-left text-[11px] font-medium leading-none text-grey">Before</span>
          <span className="text-left text-[11px] font-medium leading-none text-grey">After</span>
        </div>

        {/* 4 data rows */}
        <div className="flex flex-col gap-3">
          {DAILY_LEGEND_ITEMS.map((item) => (
            <LegendRow key={item.label} item={item} />
          ))}
        </div>

        {/* Net savings */}
        <NetSavingsRow />
      </div>
    </div>
  );
}
