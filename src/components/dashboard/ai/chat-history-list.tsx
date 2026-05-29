"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Battery, FileText, Sun } from "lucide-react";
import { ChatActionsMenu } from "@/components/dashboard/ai/chat-actions-menu";
import { ChatEmptyState } from "@/components/dashboard/ai/chat-empty-state";
import { Button } from "@/components/ui/button";
import {
  getChatActionsStorageKey,
  loadStoredChatActions,
  saveStoredChatActions,
} from "@/lib/chat-actions-storage";
import type { StoredChatActions } from "@/lib/chat-actions-storage";
import { cn } from "@/lib/utils";
import type { ChatSession } from "@/types/chat";

type FilterType = "All" | "Solar" | "Alerts" | "Reports";
type ViewFilter = FilterType | "Archived";
type TagType = "Solar" | "Alert" | "Report";

interface ChatHistoryListProps {
  history: ChatSession[];
  selectedId?: string;
  userId: string; // ← new: required for per-user storage isolation
}

interface ChatGroup {
  label: "Today" | "Yesterday" | "This Week" | "Earlier";
  chats: ChatSession[];
}

const TAG_STYLES: Record<TagType, string> = {
  Solar: "bg-success-bg text-success-alt border border-chart-battery",
  Alert: "bg-danger-bg text-danger border border-danger/20",
  Report: "bg-muted text-muted-foreground border border-border",
};

function getChatDate(chat: ChatSession) {
  const value = chat.updatedAt ?? chat.createdAt ?? chat.dateLabel;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isThisWeek(date: Date, now: Date) {
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return date >= start && date <= now;
}

function getGroupLabel(chat: ChatSession): ChatGroup["label"] {
  const date = getChatDate(chat);
  if (!date) return "Earlier";
  const now = new Date();
  if (isSameDay(date, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";
  if (isThisWeek(date, now)) return "This Week";
  return "Earlier";
}

function formatChatTimestamp(chat: ChatSession) {
  const date = getChatDate(chat);
  if (!date) return chat.dateLabel ?? "";
  const time = date
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(" ", "")
    .toLowerCase();
  const group = getGroupLabel(chat);
  if (group === "Today") return `Today, ${time}`;
  if (group === "Yesterday") return `Yesterday, ${time}`;
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
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

export function ChatHistoryList({
  history,
  selectedId,
  userId,
}: ChatHistoryListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<ViewFilter>("All");

  const storageKey = getChatActionsStorageKey(userId);

  const [actions, setActions] = useState<StoredChatActions>(() =>
    loadStoredChatActions(storageKey),
  );

  const updateActions = (
    updater: (prev: StoredChatActions) => StoredChatActions,
  ) => {
    setActions((prev) => {
      const next = updater(prev);
      saveStoredChatActions(storageKey, next);
      return next;
    });
  };

  const visibleChats = useMemo(() => {
    return history
      .filter((chat) => !actions.deletedIds.includes(chat.id))
      .filter((chat) => {
        if (filter === "Archived") return actions.archivedIds.includes(chat.id);
        if (actions.archivedIds.includes(chat.id)) return false;
        if (filter === "All") return true;
        if (filter === "Solar") return getTag(chat) === "Solar";
        if (filter === "Alerts") return getTag(chat) === "Alert";
        return getTag(chat) === "Report";
      })
      .map((chat) => ({
        ...chat,
        title: actions.renamedTitles[chat.id] ?? chat.title,
      }))
      .sort((a, b) => {
        const aPinned = actions.pinnedIds.includes(a.id);
        const bPinned = actions.pinnedIds.includes(b.id);
        if (aPinned !== bPinned) return aPinned ? -1 : 1;
        const aTime = getChatDate(a)?.getTime() ?? 0;
        const bTime = getChatDate(b)?.getTime() ?? 0;
        return bTime - aTime;
      });
  }, [actions, filter, history]);
  const hasVisibleHistory = history.some(
    (chat) =>
      !actions.deletedIds.includes(chat.id) &&
      !actions.archivedIds.includes(chat.id),
  );
  const groups = useMemo(() => {
    const orderedLabels: ChatGroup["label"][] = [
      "Today",
      "Yesterday",
      "This Week",
      "Earlier",
    ];
    return orderedLabels
      .map((label) => ({
        label,
        chats: visibleChats.filter((chat) => getGroupLabel(chat) === label),
      }))
      .filter((group) => group.chats.length > 0);
  }, [visibleChats]);
  const filters: ViewFilter[] = [
    "All",
    "Solar",
    "Alerts",
    "Reports",
    "Archived",
  ];
  if (!hasVisibleHistory) {
    return <ChatEmptyState />;
  }
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
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div
            key={group.label}
            className="rounded-xl border border-border bg-card"
          >
            <div className="px-5 py-3">
              <span className="text-xs font-semibold text-muted-foreground">
                {group.label}
              </span>
            </div>
            <div className="divide-y divide-border">
              {group.chats.map((chat) => {
                const tag = getTag(chat);
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40",
                      selectedId === chat.id && "bg-muted/60",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/dashboard/ai-assistant/${chat.id}`)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/dashboard/ai-assistant/${chat.id}`);
                        }
                      }}
                      className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 bg-transparent text-left"
                    >
                      <RowIcon tag={tag} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {actions.pinnedIds.includes(chat.id)
                            ? "Pinned - "
                            : ""}
                          {chat.title || "Untitled chat"}
                        </p>
                        {chat.description ? (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {chat.description}
                          </p>
                        ) : null}
                        <div className="mt-2">
                          <TagBadge tag={tag} />
                        </div>
                      </div>
                    </button>
                    <div className="flex shrink-0 items-center gap-2">
                      {filter === "Archived" &&
                      actions.archivedIds.includes(chat.id) ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateActions((prev) => ({
                              ...prev,
                              archivedIds: prev.archivedIds.filter(
                                (id) => id !== chat.id,
                              ),
                            }))
                          }
                          className="px-2 py-1 text-xs text-primary hover:underline"
                        >
                          Unarchive
                        </button>
                      ) : (
                        <>
                          <span className="whitespace-nowrap text-xs text-muted-foreground">
                            {formatChatTimestamp(chat)}
                          </span>
                          <ChatActionsMenu
                            chatId={chat.id}
                            title={chat.title}
                            isPinned={actions.pinnedIds.includes(chat.id)}
                            onRename={(id, nextTitle) =>
                              updateActions((prev) => ({
                                ...prev,
                                renamedTitles: {
                                  ...prev.renamedTitles,
                                  [id]: nextTitle,
                                },
                              }))
                            }
                            onPin={(id) =>
                              updateActions((prev) => ({
                                ...prev,
                                pinnedIds: prev.pinnedIds.includes(id)
                                  ? prev.pinnedIds.filter((item) => item !== id)
                                  : [...prev.pinnedIds, id],
                              }))
                            }
                            onArchive={(id) => {
                              updateActions((prev) => ({
                                ...prev,
                                archivedIds: prev.archivedIds.includes(id)
                                  ? prev.archivedIds
                                  : [...prev.archivedIds, id],
                              }));
                              setFilter("Archived");
                            }}
                            onDelete={(id) =>
                              updateActions((prev) => ({
                                ...prev,
                                deletedIds: prev.deletedIds.includes(id)
                                  ? prev.deletedIds
                                  : [...prev.deletedIds, id],
                              }))
                            }
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {visibleChats.length === 0 && filter !== "Archived" ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            No chats found.
          </div>
        ) : filter === "Archived" && visibleChats.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-8 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            No archived chats.
          </div>
        ) : null}
      </div>
    </div>
  );
}

