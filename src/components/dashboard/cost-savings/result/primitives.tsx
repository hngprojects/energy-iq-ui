import { cn } from "@/lib/utils";


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
  value,
  bold = false,
}: {
  dot?: boolean;
  label: string;
  value: string;
  bold?: boolean;
}) {
  const desktopValue = bold
    ? "text-[13px] font-semibold leading-normal text-slate-100 text-right truncate"
    : "text-[13px] font-medium leading-normal text-grey text-right truncate";

  const mobileValue = bold
    ? "text-[11px] font-semibold leading-normal text-slate-100 text-right truncate"
    : "text-[11px] font-medium leading-normal text-grey text-right truncate";

  const dotOrSpacer = dot
    ? <Dot />
    : <span className="inline-block w-3 h-3 shrink-0" aria-hidden="true" />;

  return (
    <>
      {/* ── Desktop ── */}
      <div
        className="hidden lg:grid items-center w-full"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          {dotOrSpacer}
          <span className={cn(
            bold
              ? "text-[13px] font-semibold leading-normal text-slate-100"
              : "text-[13px] font-medium leading-normal text-grey",
            "truncate min-w-0",
          )}>
            {label}
          </span>
        </span>
        <span className={desktopValue}>{value}</span>
      </div>

      {/* ── Mobile / Tablet ── */}
      <div
        className="grid lg:hidden items-center w-full"
        style={{ gridTemplateColumns: "1fr auto", columnGap: "8px" }}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          {dotOrSpacer}
          <span className={cn(
            bold
              ? "text-[11px] font-semibold leading-normal text-slate-100"
              : "text-[11px] font-medium leading-normal text-grey",
            "truncate min-w-0",
          )}>
            {label}
          </span>
        </span>
        <span className={mobileValue}>{value}</span>
      </div>
    </>
  );
}


export function LegendRow({ item }: { item: { label: string; value: string } }) {
  return (
    <BreakdownTableRow dot label={item.label} value={item.value} />
  );
}

export function NetSavingsRow({
  value = "₦17,740",
}: {
  value?: string;
} = {}) {
  return (
    <div className="border-t border-border pt-3 mt-1">
      <BreakdownTableRow dot={false} label="Net Savings" value={value} bold />
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
  const isLong = value.length > 10;
  const isVeryLong = value.length > 13;

  const fontSizeClass = isVeryLong
    ? "text-[16px] sm:text-[18px] lg:text-[16px] xl:text-[18px]"
    : isLong
      ? "text-[18px] sm:text-[22px] lg:text-[18px] xl:text-[22px]"
      : "text-[24px] sm:text-[28px] lg:text-[22px] xl:text-[28px]";

  return (
    <div
      className={cn(
        "flex flex-col justify-between",
        "rounded-lg border bg-card border-border",
        "px-3.5 py-4 min-w-0",
      )}
    >
      <p className="text-[13px] lg:text-sm font-medium leading-none text-slate-90 truncate" title={label}>
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-bold leading-none tracking-tight text-primary truncate",
          fontSizeClass
        )}
        style={{ letterSpacing: "-0.01em" }}
        title={value}
      >
        {value}
      </p>
      <p className="mt-auto pt-4 lg:pt-6 text-xs font-normal leading-none text-grey truncate" title={note}>
        {note}
      </p>
    </div>
  );
}
