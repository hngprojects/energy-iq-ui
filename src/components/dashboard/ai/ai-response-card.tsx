"use client";

import {
  AlertTriangle,
  Lightbulb,
  ListChecks,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiResponseCard, AiResponseCardType } from "@/types/chat";

interface AiResponseCardProps {
  card: AiResponseCard;
  className?: string;
  style?: React.CSSProperties;
}

const cardStyles: Record<
  AiResponseCardType,
  {
    border: string;
    bg: string;
    icon: string;
    label: string;
    Icon: LucideIcon;
    labelText: string;
  }
> = {
  summary: {
    border: "border-slate-300",
    bg: "bg-slate-50",
    icon: "text-slate-700",
    label: "text-slate-800",
    Icon: ListChecks,
    labelText: "Summary",
  },
  insight: {
    border: "border-violet-300",
    bg: "bg-violet-50",
    icon: "text-violet-800",
    label: "text-violet-900",
    Icon: Lightbulb,
    labelText: "Insight",
  },
  anomaly: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    icon: "text-amber-900",
    label: "text-amber-950",
    Icon: AlertTriangle,
    labelText: "Anomaly",
  },
  recommendation: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    icon: "text-emerald-800",
    label: "text-emerald-900",
    Icon: Zap,
    labelText: "Recommendation",
  },
  alert: {
    border: "border-red-300",
    bg: "bg-red-50",
    icon: "text-red-800",
    label: "text-red-900",
    Icon: AlertTriangle,
    labelText: "Alert",
  },
};

const severityBadgeStyles = {
  critical: "bg-red-700 text-white ring-1 ring-red-800",
  warning: "bg-amber-900 text-white ring-1 ring-amber-950",
  info: "bg-slate-700 text-white ring-1 ring-slate-800",
};

function resolveSeverity(card: AiResponseCard) {
  if (card.severity) return card.severity;
  if (card.type === "anomaly" || card.type === "alert") return "warning";
  return undefined;
}

export function AiResponseCardView({
  card,
  className,
  style,
}: AiResponseCardProps) {
  const config = cardStyles[card.type] ?? cardStyles.insight;
  const Icon = config.Icon;
  const severity = resolveSeverity(card);

  return (
    <article
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-all duration-300",
        config.border,
        config.bg,
        className,
      )}
      style={style}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.icon)} />
          <div className="min-w-0">
            <p
              className={cn(
                "text-[11px] font-bold uppercase tracking-wide",
                config.label,
              )}
            >
              {config.labelText}
            </p>
            <h3 className="text-sm font-semibold leading-snug text-slate-900">
              {card.headline}
            </h3>
          </div>
        </div>
        {severity ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize",
              severityBadgeStyles[severity],
            )}
          >
            {severity}
          </span>
        ) : null}
      </div>

      {card.dataPoint ? (
        <p className="mb-2 text-xs font-semibold text-slate-800">
          {card.dataPoint}
        </p>
      ) : null}

      {card.description ? (
        <p className="max-h-48 overflow-y-auto text-sm leading-relaxed text-slate-800 wrap-break-word whitespace-pre-wrap">
          {card.description}
        </p>
      ) : null}

      {card.actionLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 h-8 border-slate-300 bg-white text-xs text-slate-900 hover:bg-slate-50"
          onClick={() => {
            if (card.actionHref) {
              window.open(card.actionHref, "_blank", "noopener,noreferrer");
            }
          }}
        >
          {card.actionLabel}
        </Button>
      ) : null}
    </article>
  );
}

interface AiResponseCardsListProps {
  cards: AiResponseCard[];
  animate?: boolean;
}

export function AiResponseCardsList({
  cards,
  animate = true,
}: AiResponseCardsListProps) {
  if (cards.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      {cards.map((card, index) => (
        <AiResponseCardView
          key={`${card.type}-${card.headline}-${index}`}
          card={card}
          className={cn(
            animate && "animate-in fade-in slide-in-from-bottom-2 duration-300",
          )}
          style={
            animate
              ? { animationDelay: `${index * 180}ms`, animationFillMode: "both" }
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function AiResponseCardsLoading() {
  return (
    <div className="flex flex-col gap-3" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Preparing your energy insights…</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl border border-border bg-muted/40"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
