"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Battery, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatActionsMenu } from "@/components/dashboard/ai/chat-actions-menu";

type FilterType = "All" | "Solar" | "Alerts" | "Reports";
type TagType = "Solar" | "Alert" | "Report";

interface ChatHistoryItem {
  id: string;
  title: string;
  description: string;
  tag: TagType;
  timestamp: string;
  icon: "alert" | "battery" | "report";
}

interface ChatHistoryGroup {
  label: string;
  items: ChatHistoryItem[];
}

const MOCK_HISTORY: ChatHistoryGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "solar-optimization-202",
        title: "Solar Output Drop – Unit 3",
        description:
          "Identified a 28% drop vs forecast. Likely inverter throttling",
        tag: "Solar",
        timestamp: "Today, 6:10am",
        icon: "alert",
      },
      {
        id: "battery-critical-101",
        title: "Battery Critically Low – 3%",
        description: "Battery at 3% – recommend load shedding immediately",
        tag: "Alert",
        timestamp: "Today, 7:40am",
        icon: "battery",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "weekly-report-301",
        title: "Weekly Report – 28 Apr",
        description: "Report generated and sent to 3 recipients.",
        tag: "Report",
        timestamp: "Yesterday, 6:10am",
        icon: "report",
      },
    ],
  },
  {
    label: "This Week",
    items: [
      {
        id: "solar-optimization-202",
        title: "Solar Output Drop – Unit 3",
        description:
          "Identified a 28% drop vs forecast. Likely inverter throttling",
        tag: "Solar",
        timestamp: "Today, 6:10am",
        icon: "alert",
      },
      {
        id: "battery-critical-101",
        title: "Battery Critically Low – 3%",
        description: "Battery at 3% – recommend load shedding immediately",
        tag: "Alert",
        timestamp: "Today, 7:40am",
        icon: "battery",
      },
      {
        id: "battery-critical-101",
        title: "Battery Critically Low – 5%",
        description: "Battery at 5% – recommend load shedding immediately",
        tag: "Alert",
        timestamp: "2 May",
        icon: "alert",
      },
      {
        id: "battery-critical-101",
        title: "Battery Critically Low – 3%",
        description: "Battery at 3% – recommend load shedding immediately",
        tag: "Alert",
        timestamp: "4 May",
        icon: "battery",
      },
    ],
  },
];

// ─── Tag badge ────────────────────────────────────────────────────────────────
const TAG_STYLES: Record<TagType, string> = {
  Solar: "bg-success-bg text-chart-battery border border-chart-battery/20",
  Alert: "bg-danger-bg text-danger border border-danger/20",
  Report: "bg-muted text-muted-foreground border border-border",
};

function TagBadge({ tag }: { tag: TagType }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        TAG_STYLES[tag],
      )}
    >
      {tag}
    </span>
  );
}

function RowIcon({ type }: { type: ChatHistoryItem["icon"] }) {
  const base =
    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted";

  if (type === "report") {
    return (
      <div className={base}>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }
  if (type === "battery") {
    return (
      <div className={base}>
        <Battery className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className={base}>
      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function filterGroups(
  groups: ChatHistoryGroup[],
  filter: FilterType,
): ChatHistoryGroup[] {
  if (filter === "All") return groups;
  const tagMap: Record<FilterType, TagType | null> = {
    All: null,
    Solar: "Solar",
    Alerts: "Alert",
    Reports: "Report",
  };
  const tag = tagMap[filter];
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.tag === tag) }))
    .filter((g) => g.items.length > 0);
}

interface ChatHistoryListProps {
  selectedId?: string;
}

export function ChatHistoryList({ selectedId }: ChatHistoryListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("All");
  const filters: FilterType[] = ["All", "Solar", "Alerts", "Reports"];
  const visible = filterGroups(MOCK_HISTORY, filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "outline" : "ghost"}
            onClick={() => setFilter(f)}
            className={cn(
              "h-auto rounded-lg px-4 py-1.5 text-sm font-medium transition-colors shadow-none",
              filter === f
                ? "border-primary text-primary bg-transparent hover:bg-transparent hover:text-primary"
                : "bg-muted text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800",
            )}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {visible.map((group) => (
          <div
            key={group.label}
            className="rounded-xl border border-border bg-card"
          >
            <div className="px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </span>
            </div>
            <div className="divide-y divide-border">
              {group.items.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() =>
                    router.push(`/dashboard/ai-assistant/${item.id}`)
                  }
                  className={cn(
                    "flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40",
                    selectedId === item.id && "bg-muted/60",
                    idx === 0 && "rounded-t-none",
                    idx === group.items.length - 1 && "rounded-b-xl",
                  )}
                >
                  <RowIcon type={item.icon} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {item.timestamp}
                        </span>
                        <ChatActionsMenu chatId={item.id} />
                      </div>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-2">
                      <TagBadge tag={item.tag} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
