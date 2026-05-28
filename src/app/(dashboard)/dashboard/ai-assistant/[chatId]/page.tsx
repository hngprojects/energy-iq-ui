"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Download,
  Mic,
  Send,
  Sun,
  Zap,
} from "lucide-react";
import { AttachMenu } from "@/components/dashboard/ai/attach-menu";
import { ChatActionsMenu } from "@/components/dashboard/ai/chat-actions-menu";
import { LanguageToggle } from "@/components/dashboard/ai/language-toggle";
import { ChatMessageBubble } from "@/components/dashboard/ai/chat-message-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActiveChat } from "@/hooks/use-chat-queries";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import { useChatSocket } from "@/hooks/use-chat-socket";
import {
  getChatActionsStorageKey,
  loadStoredChatActions,
  saveStoredChatActions,
} from "@/lib/chat-actions-storage";
import type { StoredChatActions } from "@/lib/chat-actions-storage";
import { useAuthStore } from "@/stores/auth-store";
import { getUserInitials } from "@/lib/user-initials";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
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
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const resolvedParams = use(params);
  const chatId = resolvedParams.chatId;
  const { chatInfo, messages, setMessages, loading, error } =
    useActiveChat(chatId);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const streamingMessageIdRef = useRef<string | null>(null);
  const pendingMessageSentRef = useRef(false);
  const userInitials = getUserInitials(user);
  const storageKey = getChatActionsStorageKey(userId);

  const [actions, setActions] = useState<StoredChatActions>(() =>
    loadStoredChatActions(storageKey),
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastUserMessageRef = useRef<string>("");

  const {
    connected,
    connecting,
    socketError,
    sendMessage,
    // joinActiveChats,
    subscribeToSystemMessages,
  } = useChatSocket(chatId);

  const clearSendingTimeout = useCallback(() => {
    if (sendingTimeoutRef.current) {
      clearTimeout(sendingTimeoutRef.current);
      sendingTimeoutRef.current = null;
    }
  }, []);

  const startSendingTimeout = useCallback(
    (assistantMessageId: string) => {
      clearSendingTimeout();
      sendingTimeoutRef.current = setTimeout(() => {
        streamingMessageIdRef.current = null;
        setSending(false);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  role: "assistant" as const,
                  content: message.content || "",
                  error: "Response timed out. Please try again.",
                  isStreaming: false,
                  failed: true,
                }
              : message,
          ),
        );
      }, 10_000);
    },
    [clearSendingTimeout, setMessages],
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

  useEffect(() => {
    setActions(loadStoredChatActions(storageKey));
  }, [storageKey]);

  useEffect(() => {
    pendingMessageSentRef.current = false;
    streamingMessageIdRef.current = null;
    clearSendingTimeout();
    setSending(false);
  }, [chatId, clearSendingTimeout]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => clearSendingTimeout();
  }, [clearSendingTimeout]);

  useEffect(() => {
    return subscribeToSystemMessages((incoming) => {
      if (!incoming.text && !incoming.isFinal && !streamingMessageIdRef.current)
        return;

      const activeStreamingId = streamingMessageIdRef.current;

      setMessages((prev) => {
        if (!activeStreamingId) {
          const newMessageId = incoming.id || `assistant-${Date.now()}`;
          streamingMessageIdRef.current = incoming.isFinal
            ? null
            : newMessageId;
          return [
            ...prev,
            {
              id: newMessageId,
              role: "assistant" as const,
              content: incoming.text,
              timestamp: formatMessageTime(incoming.timestamp),
              isStreaming: !incoming.isFinal,
            },
          ];
        }

        return prev.map((message) => {
          if (message.id !== activeStreamingId) return message;

          const nextContent = incoming.isChunk
            ? `${message.content}${incoming.text}`
            : incoming.text || message.content;

          if (incoming.isFinal) {
            return nextContent.trim()
              ? {
                  ...message,
                  content: nextContent,
                  isStreaming: false,
                  timestamp: formatMessageTime(incoming.timestamp),
                }
              : {
                  ...message,
                  content: nextContent,
                  isStreaming: false,
                  failed: true,
                  error:
                    "The assistant didn't return a response. Please try again.",
                  timestamp: formatMessageTime(incoming.timestamp),
                };
          }

          return {
            ...message,
            content: nextContent,
            isStreaming: true,
            timestamp: formatMessageTime(incoming.timestamp),
          };
        });
      });

      if (incoming.sessionId) {
        localStorage.setItem(`chat-session:${chatId}`, incoming.sessionId);
      }

      if (incoming.isFinal) {
        streamingMessageIdRef.current = null;
        setSending(false);
        clearSendingTimeout();
      }
    });
  }, [chatId, clearSendingTimeout, setMessages, subscribeToSystemMessages]);

  useEffect(() => {
    if (!socketError) return;

    const activeId = streamingMessageIdRef.current;
    clearSendingTimeout();
    setSending(false);
    streamingMessageIdRef.current = null;

    setMessages((prev) => {
      const updated = activeId
        ? prev.map((message) =>
            message.id === activeId
              ? {
                  ...message,
                  isStreaming: false,
                  failed: true,
                  error: "Connection lost. Check your internet and try again.",
                }
              : message,
          )
        : prev;

      const lastMessage = updated[updated.length - 1];
      if (
        lastMessage?.role === "system" &&
        lastMessage.content === socketError
      ) {
        return updated;
      }

      return [
        ...updated,
        {
          id: `socket-error-${Date.now()}`,
          role: "system" as const,
          content: socketError,
          timestamp: formatMessageTime(),
          failed: true,
        },
      ];
    });
  }, [clearSendingTimeout, setMessages, socketError]);

  useEffect(() => {
    if (!socketError) return;

    const key = `pending-chat-message:${chatId}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return;

    setMessages((prev) => {
      const hasPendingNotice = prev.some(
        (message) =>
          message.role === "system" &&
          message.id === `pending-socket-error-${chatId}`,
      );

      if (hasPendingNotice) return prev;

      return [
        ...prev,
        {
          id: `pending-socket-error-${chatId}`,
          role: "system",
          content:
            "Your message was saved, but the AI connection is not available yet.",
          timestamp: formatMessageTime(),
          failed: true,
        },
      ];
    });
  }, [chatId, setMessages, socketError]);

  useEffect(() => {
    if (!connected) return;
    if (pendingMessageSentRef.current) return;

    const key = `pending-chat-message:${chatId}`;
    const raw = sessionStorage.getItem(key);

    if (!raw) return;

    let text = "";
    let timestamp: string | undefined;

    try {
      const pending = JSON.parse(raw) as {
        content?: string;
        timestamp?: string;
      };

      text = pending.content?.trim() ?? "";
      timestamp = pending.timestamp;
    } catch {
      sessionStorage.removeItem(key);
      return;
    }

    if (!text) {
      sessionStorage.removeItem(key);
      return;
    }

    pendingMessageSentRef.current = true;
    sessionStorage.removeItem(key);

    const assistantMessageId = `assistant-stream-${Date.now()}`;
    streamingMessageIdRef.current = assistantMessageId;

    setMessages((prev) => {
      const alreadyExists = prev.some(
        (message) =>
          message.role === "user" &&
          message.content.trim() === text &&
          message.id === `pending-${chatId}`,
      );

      return [
        ...(alreadyExists
          ? prev
          : [
              ...prev,
              {
                id: `pending-${chatId}`,
                role: "user" as const,
                content: text,
                timestamp: formatMessageTime(timestamp),
                userInitials,
              },
            ]),
        {
          id: assistantMessageId,
          role: "assistant" as const,
          content: "",
          timestamp: formatMessageTime(),
          isStreaming: true,
        },
      ];
    });

    setSending(true);

    try {
      sendMessage(text);
      startSendingTimeout(assistantMessageId);
    } catch (error) {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          content: text,
          timestamp,
        }),
      );
      pendingMessageSentRef.current = false;
      streamingMessageIdRef.current = null;
      setSending(false);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                role: "assistant" as const,
                content: message.content || "",
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to send your first message. Please try again.",
                isStreaming: false,
                failed: true,
              }
            : message,
        ),
      );
    }
  }, [
    chatId,
    connected,
    sendMessage,
    setMessages,
    startSendingTimeout,
    userInitials,
  ]);

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

  const formatMessageTime = (value?: string) => {
    const date = value ? new Date(value) : new Date();

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getSessionId = () =>
    localStorage.getItem(`chat-session:${chatId}`) ?? undefined;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    if (!connected) {
      setMessages((prev) => [
        ...prev,
        {
          id: `socket-not-connected-${Date.now()}`,
          role: "system",
          content: connecting
            ? "Chat is still connecting. Please wait a moment and try again."
            : socketError ||
              "Chat is not connected. Please refresh and try again.",
          timestamp: formatMessageTime(),
          failed: true,
        },
      ]);
      return;
    }

    setInput("");
    resetComposer();
    setSending(true);

    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: formatMessageTime(),
      userInitials,
    };

    const assistantMessageId = `assistant-stream-${Date.now()}`;
    streamingMessageIdRef.current = assistantMessageId;

    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: formatMessageTime(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

    try {
      lastUserMessageRef.current = text;

      sendMessage(text, getSessionId());
      startSendingTimeout(assistantMessageId);
    } catch (error) {
      streamingMessageIdRef.current = null;
      setSending(false);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                role: "assistant" as const,
                content: message.content || "",
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to send message. Please try again.",
                isStreaming: false,
                failed: true,
              }
            : message,
        ),
      );
    }
  };

  const handleRetry = (failedAssistantId: string) => {
    const text = lastUserMessageRef.current;
    if (!text) return;

    if (!connected) {
      setMessages((prev) => [
        ...prev,
        {
          id: `retry-not-connected-${Date.now()}`,
          role: "system" as const,
          content: connecting
            ? "Chat is still connecting. Please wait a moment and try again."
            : "Chat is not connected. Please refresh and try again.",
          timestamp: formatMessageTime(),
          failed: true,
        },
      ]);
      return;
    }

    const assistantMessageId = `assistant-stream-${Date.now()}`;
    streamingMessageIdRef.current = assistantMessageId;

    setMessages((prev) => [
      ...prev.filter((m) => m.id !== failedAssistantId),
      {
        id: assistantMessageId,
        role: "assistant" as const,
        content: "",
        timestamp: formatMessageTime(),
        isStreaming: true,
      },
    ]);

    setSending(true);
    try {
      sendMessage(text, getSessionId());
      startSendingTimeout(assistantMessageId);
    } catch (error) {
      streamingMessageIdRef.current = null;
      setSending(false);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                role: "assistant" as const,
                content: "",
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to retry message. Please try again.",
                isStreaming: false,
                failed: true,
              }
            : message,
        ),
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
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
      <div className="flex shrink-0 items-center gap-2 md:gap-3 border-b border-border bg-card px-3 py-3 md:px-6 md:py-4 shadow-sm">
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
          <p className="truncate text-xs text-muted-foreground">
            {dateLabel} &nbsp;·&nbsp; {messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
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
          <div className="flex flex-col gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex gap-3 animate-pulse ${
                  i % 2 === 1 ? "flex-row-reverse" : ""
                }`}
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />

                <div className="flex flex-col gap-2">
                  <div
                    className={`h-4 rounded-full bg-muted ${
                      i % 2 === 1 ? "w-24 self-end" : "w-32"
                    }`}
                  />

                  <div
                    className={`h-10 rounded-xl bg-muted ${
                      i % 2 === 1 ? "w-48 self-end" : "w-64"
                    }`}
                  />

                  <div
                    className={`h-4 rounded-full bg-muted/60 ${
                      i % 2 === 1 ? "w-16 self-end" : "w-20"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onRetry={handleRetry}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="shrink-0 border-t border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2.5">
          <AttachMenu buttonClassName="h-7 w-7 rounded-full text-foreground hover:bg-transparent hover:text-foreground" />
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
              disabled={!input.trim() || sending || connecting || !connected}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border-0 p-0 shadow-none transition-colors",
                input.trim() && !sending && connected
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
