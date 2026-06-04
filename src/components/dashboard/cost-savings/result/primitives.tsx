import { cn } from "@/lib/utils";
import type { LegendItem } from "@/lib/mocks/cost-savings-results";


export function Dot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 shrink-0 rounded-full bg-coral"
    />
  );
}


export function BreakdownTableRow({
  dot,
  label,
  before,
  after,
  bold = false,
}: {
  dot?: boolean;
  label: string;
  before: string;
  after: string;
  bold?: boolean;
}) {
  const desktopValue = bold
    ? "text-[13px] font-semibold leading-none text-slate-100 text-left truncate"
    : "text-[13px] font-medium leading-none text-grey text-left truncate";

  const mobileValue = bold
    ? "text-[11px] font-semibold leading-none text-slate-100 text-left truncate"
    : "text-[11px] font-medium leading-none text-grey text-left truncate";

  const dotOrSpacer = dot
    ? <Dot />
    : <span className="inline-block w-3 h-3 shrink-0" aria-hidden="true" />;

  return (
    <>
      {/* ── Desktop ── */}
      <div
        className="hidden lg:grid items-center w-full"
        style={{ gridTemplateColumns: "1fr 94px 55px 94px 55px" }}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          {dotOrSpacer}
          <span className={cn(
            bold
              ? "text-[13px] font-semibold leading-none text-slate-100"
              : "text-[13px] font-medium leading-none text-grey",
            "truncate min-w-0",
          )}>
            {label}
          </span>
        </span>
        <span />
        <span className={desktopValue}>{before}</span>
        <span />
        <span className={desktopValue}>{after}</span>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div
        className="grid lg:hidden items-center w-full"
        style={{ gridTemplateColumns: "1fr 56px 56px", columnGap: "8px" }}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          {dotOrSpacer}
          <span className={cn(
            bold
              ? "text-[11px] font-semibold leading-none text-slate-100"
              : "text-[11px] font-medium leading-none text-grey",
            "truncate min-w-0",
          )}>
            {label}
          </span>
        </span>
        <span className={mobileValue}>{before}</span>
        <span className={mobileValue}>{after}</span>
      </div>
    </>
  );
}


export function LegendRow({ item }: { item: LegendItem }) {
  return (
    <BreakdownTableRow dot label={item.label} before={item.before} after={item.after} />
  );
}

export function NetSavingsRow() {
  return (
    <div className="border-t border-border pt-3 mt-1">
      <BreakdownTableRow dot={false} label="Net Savings" before="₦23,000" after="₦17,740" bold />
    </div>
  );
}


export function SavingsCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between",
        "rounded-lg border bg-card border-amber-50",
        "px-3.5 py-4 min-w-0",
      )}
    >
      <p className="text-[13px] lg:text-sm font-medium leading-none text-slate-90">
        {label}
      </p>
      <p
        className="mt-1.5 text-[24px] sm:text-[28px] lg:text-[28px] font-bold leading-none tracking-tight text-primary"
        style={{ letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
      <p className="mt-auto pt-4 lg:pt-6 text-xs font-normal leading-none text-grey">
        {note}
      </p>
    </div>
  );
}
