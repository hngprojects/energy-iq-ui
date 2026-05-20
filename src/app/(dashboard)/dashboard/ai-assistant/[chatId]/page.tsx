"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Battery,
  Download,
  Mic,
  MoreVertical,
  Plus,
  Send,
  Sun,
  Zap,
} from "lucide-react";
import { ChatMessageBubble } from "@/components/dashboard/ai/chat-message-bubble";
import { cn } from "@/lib/utils";
import {
  MOCK_AI_CHATS,
  getMockAIResponse,
  Message,
} from "@/lib/mocks/ai-chats";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const chatSession =
    MOCK_AI_CHATS[resolvedParams.chatId] ||
    MOCK_AI_CHATS["battery-critical-101"];

  const [messages, setMessages] = useState<Message[]>(chatSession.messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      userInitials: "AA",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const simulatedAI = await getMockAIResponse(text);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: simulatedAI.content || "Processing complete.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderHeaderIcon = () => {
    switch (chatSession.iconType) {
      case "solar":
        return <Sun className="h-4 w-4 text-amber-500" />;
      case "grid":
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Battery className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    /* 1. CRITICAL: Fixed height calculation that pins the component to the window bounds.
         overflow-hidden stops the layout/body from growing or scrolling.
    */
    <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-70px)] w-full flex-col overflow-hidden bg-background text-foreground">
      {/* ── HEADER (Stays perfectly static at the top of this container) ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-6 py-4 shadow-sm">
        <button
          title="Go back"
          onClick={() => router.push("/dashboard/ai-assistant")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          {renderHeaderIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {chatSession.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {chatSession.dateLabel} &nbsp;·&nbsp; {messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            title="Download"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            title="More options"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CHAT BOX (Only this specific element scrolls) ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Date divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Today</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-5">
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {loading && (
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
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT CONTROL FOOTER (Stays perfectly locked at the bottom) ── */}
      <div className="shrink-0 border-t border-border bg-card px-6 py-4">
        <div className="flex items-end gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
          <button
            type="button"
            title="Attach"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your energy system"
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none h-auto",
              "max-h-32 leading-5",
            )}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              title="Voice input"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Send message"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                input.trim() && !loading
                  ? "bg-secondary text-secondary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
