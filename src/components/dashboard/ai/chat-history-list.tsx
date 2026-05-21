"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Battery, FileText, Sun } from "lucide-react";
import { ChatActionsMenu } from "@/components/dashboard/ai/chat-actions-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/types/chat";

type FilterType = "All" | "Solar" | "Alerts" | "Reports";
type TagType = "Solar" | "Alert" | "Report";

interface ChatHistoryListProps {
  history: ChatSession[];
  selectedId?: string;
}

const TAG_STYLES: Record<TagType, string> = {
  Solar: "bg-success-bg text-chart-battery border border-chart-battery/20",
  Alert: "bg-danger-bg text-danger border border-danger/20",
  Report: "bg-muted text-muted-foreground border border-border",
};

function formatTime(value?: string) {
  if (!value) return "Today";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTag(chat: ChatSession): TagType {
  if (chat.tag) return chat.tag;

  const text = `${chat.title} ${chat.description ?? ""}`.toLowerCase();

  if (text.includes("solar")) return "Solar";
  if (text.includes("report")) return "Report";
  return "Alert";
}

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

function RowIcon({ tag }: { tag: TagType }) {
  const base =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted";

  if (tag === "Solar") {
    return (
      <div className={base}>
        <Sun className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  if (tag === "Report") {
    return (
      <div className={base}>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={base}>
      <Battery className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

export function ChatHistoryList({ history, selectedId }: ChatHistoryListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("All");

  const visibleChats = useMemo(() => {
    return history.filter((chat) => {
      if (filter === "All") return true;
      if (filter === "Solar") return getTag(chat) === "Solar";
      if (filter === "Alerts") return getTag(chat) === "Alert";
      return getTag(chat) === "Report";
    });
  }, [filter, history]);

  const filters: FilterType[] = ["All", "Solar", "Alerts", "Reports"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {filters.map((item) => (
          <Button
            key={item}
            variant={filter === item ? "outline" : "ghost"}
            onClick={() => setFilter(item)}
            className={cn(
              "h-auto rounded-lg px-4 py-1.5 text-sm font-medium shadow-none",
              filter === item
                ? "border-primary bg-transparent text-primary hover:bg-transparent"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </span>
        </div>

        <div className="divide-y divide-border">
          {visibleChats.map((chat) => {
            const tag = getTag(chat);

            return (
              <div
                key={chat.id}
                onClick={() =>
                  router.push(`/dashboard/ai-assistant/${chat.id}`)
                }
                className={cn(
                  "flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40",
                  selectedId === chat.id && "bg-muted/60",
                )}
              >
                <RowIcon tag={tag} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {chat.title || "Untitled chat"}
                    </p>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatTime(
                          chat.updatedAt ?? chat.createdAt ?? chat.dateLabel,
                        )}
                      </span>

                      <ChatActionsMenu chatId={chat.id} />
                    </div>
                  </div>

                  {chat.description ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {chat.description}
                    </p>
                  ) : null}

                  <div className="mt-2">
                    <TagBadge tag={tag} />
                  </div>
                </div>
              </div>
            );
          })}

          {visibleChats.length === 0 ? (
            <div className="flex items-center gap-2 px-5 py-8 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              No chats found for this filter.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
