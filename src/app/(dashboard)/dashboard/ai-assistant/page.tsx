"use client";
import { Download, History, Plus } from "lucide-react";
import Link from "next/link";
import { ChatEmptyState } from "@/components/dashboard/ai/chat-empty-state";
import { ChatHistoryList } from "@/components/dashboard/ai/chat-history-list";
import { Button } from "@/components/ui/button";
import { useChatHistory } from "@/hooks/use-chat-queries";
import { useAuthStore } from "@/stores/auth-store";

export default function AIAssistantPage() {
  const { history, loading, error, refreshHistory } = useChatHistory();

  const userId = useAuthStore((state) => state.user?.id);

  const skeletonWidths = [
    "w-[55%]",
    "w-[70%]",
    "w-[45%]",
    "w-[65%]",
    "w-[50%]",
    "w-[60%]",
  ];

  if (error) {
    console.debug("[AIAssistantPage] Failed to load chat history:", error);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-lg"
            title="Chat history"
            className="h-9 w-9 text-muted-foreground hover:bg-muted"
          >
            <History className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon-lg"
            title="Download"
            className="h-9 w-9 text-muted-foreground hover:bg-muted"
          >
            <Download className="h-6 w-6" />
          </Button>
          <Button
            asChild
            variant="secondary"
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium shadow-none rounded-lg"
          >
            <Link href="/dashboard/ai-assistant/new">
              <Plus className="h-4 w-4" />
              New Chat
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading || !userId ? (
          <div className="flex flex-col gap-1 px-6 py-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-xl px-3 py-3"
              >
                <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className={`h-3 rounded-full bg-muted ${skeletonWidths[i]}`}
                    />
                    <div className="h-3 w-10 rounded-full bg-muted/60" />
                  </div>
                  <div className="h-3 w-3/4 rounded-full bg-muted/50" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-start gap-3 px-6 py-8">
            <p className="text-sm text-destructive">
              Failed to load chat history.
            </p>
            <Button variant="outline" size="sm" onClick={refreshHistory}>
              Retry
            </Button>
          </div>
        ) : history.length > 0 ? (
          <div className="px-6 pb-8">
            <ChatHistoryList key={userId} history={history} userId={userId} />
          </div>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}
