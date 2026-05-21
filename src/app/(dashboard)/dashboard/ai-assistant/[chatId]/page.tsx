// src/app/(dashboard)/dashboard/ai-assistant/[chatId]/page.tsx
"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Download,
  Mic,
  Plus,
  Send,
  Sun,
  Zap,
} from "lucide-react";
import { ChatActionsMenu } from "@/components/dashboard/ai/chat-actions-menu";
import { ChatMessageBubble } from "@/components/dashboard/ai/chat-message-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActiveChat } from "@/hooks/use-chat-queries";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

interface StoredChatActions {
  deletedIds: string[];
  archivedIds: string[];
  pinnedIds: string[];
  renamedTitles: Record<string, string>;
}

const CHAT_ACTIONS_STORAGE_KEY = "energyiq-ai-chat-actions";

const EMPTY_ACTIONS: StoredChatActions = {
  deletedIds: [],
  archivedIds: [],
  pinnedIds: [],
  renamedTitles: {},
};

function loadStoredActions(): StoredChatActions {
  if (typeof window === "undefined") return EMPTY_ACTIONS;

  try {
    const raw = window.localStorage.getItem(CHAT_ACTIONS_STORAGE_KEY);
    if (!raw) return EMPTY_ACTIONS;

    const parsed = JSON.parse(raw) as Partial<StoredChatActions>;

    return {
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      archivedIds: Array.isArray(parsed.archivedIds) ? parsed.archivedIds : [],
      pinnedIds: Array.isArray(parsed.pinnedIds) ? parsed.pinnedIds : [],
      renamedTitles:
        parsed.renamedTitles && typeof parsed.renamedTitles === "object"
          ? parsed.renamedTitles
          : {},
    };
  } catch {
    return EMPTY_ACTIONS;
  }
}

function saveStoredActions(actions: StoredChatActions) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CHAT_ACTIONS_STORAGE_KEY,
    JSON.stringify(actions),
  );
}

function formatChatHeaderDateTime(chatInfoDate?: string) {
  const rawDate = chatInfoDate ?? new Date().toISOString();

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return `${chatInfoDate ?? "Today"}, ${new Date()
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
      .replace(" ", "")
      .toLowerCase()}`;
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const dateLabel = isSameDay(date, today)
    ? "Today"
    : isSameDay(date, yesterday)
      ? "Yesterday"
      : date.toLocaleDateString([], {
          day: "numeric",
          month: "short",
        });

  const timeLabel = date
    .toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(" ", "")
    .toLowerCase();

  return `${dateLabel}, ${timeLabel}`;
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const chatId = resolvedParams.chatId;

  const { chatInfo, messages, setMessages, loading, error } =
    useActiveChat(chatId);

  const [input, setInput] = useState("");
  const [sending] = useState(false);
  const [actions, setActions] = useState<StoredChatActions>(() =>
    loadStoredActions(),
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateActions = (
    updater: (prev: StoredChatActions) => StoredChatActions,
  ) => {
    setActions((prev) => {
      const next = updater(prev);
      saveStoredActions(next);
      return next;
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const resetComposer = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const wrapper = el.parentElement?.parentElement;
    if (wrapper) {
      wrapper.classList.remove("items-end");
      wrapper.classList.add("items-center");
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    resetComposer();

    const localMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      userInitials: "AA",
    };

    setMessages((prev) => [...prev, localMessage]);

    console.warn(
      "No backend endpoint exists in Swagger for sending a follow-up message to an existing chat.",
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;

    const wrapper = el.parentElement?.parentElement;
    if (!wrapper) return;

    if (el.scrollHeight > 36) {
      wrapper.classList.remove("items-center");
      wrapper.classList.add("items-end");
    } else {
      wrapper.classList.remove("items-end");
      wrapper.classList.add("items-center");
    }
  };

  const renderHeaderIcon = () => {
    switch (chatInfo?.iconType) {
      case "solar":
        return <Sun className="h-4 w-4 text-amber-500" />;
      case "grid":
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Battery className="h-4 w-4 text-destructive" />;
    }
  };

  const title =
    actions.renamedTitles[chatId] ??
    chatInfo?.title ??
    (loading ? "Loading chat..." : "Chat");

  const dateLabel = formatChatHeaderDateTime(
    chatInfo?.updatedAt ?? chatInfo?.createdAt ?? chatInfo?.dateLabel,
  );

  return (
    <div className="relative flex h-[calc(100vh-130px)] w-full flex-col overflow-hidden bg-background text-foreground md:h-[calc(100vh-140px)]">
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-6 py-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          title="Go back"
          aria-label="Go back"
          onClick={() => router.push("/dashboard/ai-assistant")}
          className="h-8 w-8 text-muted-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          {renderHeaderIcon()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {dateLabel} &nbsp;·&nbsp; {messages.length} messages
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Download (coming soon)"
            aria-label="Download"
            disabled
            className="h-9 w-9 text-muted-foreground hover:bg-muted"
          >
            <Download className="h-4 w-4" />
          </Button>

          <ChatActionsMenu
            chatId={chatId}
            title={title}
            triggerClassName="h-9 w-9"
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
              router.push("/dashboard/ai-assistant");
            }}
            onDelete={(id) => {
              updateActions((prev) => ({
                ...prev,
                deletedIds: prev.deletedIds.includes(id)
                  ? prev.deletedIds
                  : [...prev.deletedIds, id],
              }));
              router.push("/dashboard/ai-assistant");
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Today</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error.message}
          </div>
        ) : null}

        {loading ? (
          <div className="text-sm text-muted-foreground">
            Loading messages...
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}

            {sending ? (
              <div className="flex items-end gap-3">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-600 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-600 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-600 [animation-delay:300ms]" />
                  </div>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  AI
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Attach"
            aria-label="Attach"
            className="h-7 w-7 shrink-0 rounded-full text-foreground hover:bg-transparent hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="flex min-h-8 flex-1 items-center">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleTextareaInput}
              placeholder="Ask anything about your energy system"
              rows={1}
              className={cn(
                "h-auto max-h-32 min-h-0 w-full resize-none border-0 bg-transparent p-0 py-1 text-sm leading-5 text-foreground shadow-none outline-none placeholder:text-muted-foreground",
                "focus-visible:ring-0",
              )}
            />
          </div>

          <div className="mb-px flex shrink-0 items-center gap-2 self-end md:mb-0 md:self-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Voice input"
              aria-label="Toggle microphone"
              className="h-8 w-8 rounded-full text-foreground hover:bg-transparent hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              title="Send message"
              aria-label="Send message"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border-0 p-0 shadow-none transition-colors",
                input.trim() && !sending
                  ? "bg-secondary text-secondary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground hover:bg-muted",
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
