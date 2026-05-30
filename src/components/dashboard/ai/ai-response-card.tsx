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
  { border: string; bg: string; icon: string; Icon: LucideIcon; label: string }
> = {
  summary: {
    border: "border-slate-200",
    bg: "bg-slate-50",
    icon: "text-slate-600",
    Icon: ListChecks,
    label: "Summary",
  },
  insight: {
    border: "border-violet-200",
    bg: "bg-violet-50",
    icon: "text-violet-600",
    Icon: Lightbulb,
    label: "Insight",
  },
  anomaly: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    icon: "text-amber-700",
    Icon: AlertTriangle,
    label: "Anomaly",
  },
  recommendation: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    icon: "text-emerald-700",
    Icon: Zap,
    label: "Recommendation",
  },
  alert: {
    border: "border-red-200",
    bg: "bg-red-50",
    icon: "text-red-700",
    Icon: AlertTriangle,
    label: "Alert",
  },
};

const severityBadgeStyles = {
  critical: "bg-red-100 text-red-800",
  warning: "bg-amber-100 text-amber-800",
  info: "bg-blue-100 text-blue-800",
};

export function AiResponseCardView({
  card,
  className,
  style,
}: AiResponseCardProps) {
  const config = cardStyles[card.type] ?? cardStyles.insight;
  const Icon = config.Icon;

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
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {config.label}
            </p>
            <h3 className="text-sm font-semibold leading-snug text-foreground">
              {card.headline}
            </h3>
          </div>
        </div>
        {card.severity ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
              severityBadgeStyles[card.severity],
            )}
          >
            {card.severity}
          </span>
        ) : null}
      </div>

      {card.dataPoint ? (
        <p className="mb-2 text-xs font-medium text-foreground/80">
          {card.dataPoint}
        </p>
      ) : null}

      {card.description ? (
        <p className="max-h-48 overflow-y-auto text-sm leading-relaxed text-foreground/90 wrap-break-word whitespace-pre-wrap">
          {card.description}
        </p>
      ) : null}

      {card.actionLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 h-8 border-foreground/15 bg-white/80 text-xs"
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
