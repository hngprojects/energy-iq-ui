"use client";
import { Download, History, Plus } from "lucide-react";
import Link from "next/link";
import { ChatEmptyState } from "@/components/dashboard/ai/chat-empty-state";
import { ChatHistoryList } from "@/components/dashboard/ai/chat-history-list";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
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

  const blockClick = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const blockKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div />
        <div className="flex items-center justify-end gap-2">
          <Tooltip
            content="Chat history (coming soon)"
            side="bottom"
            align="end"
          >
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Chat history"
              aria-disabled="true"
              onClick={blockClick}
              onKeyDown={blockKeyPress}
              className="h-9 w-9 text-muted-foreground hover:bg-muted"
            >
              <History className="h-6 w-6" />
            </Button>
          </Tooltip>
          <Tooltip content="Download (coming soon)" side="bottom" align="end">
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Download"
              aria-disabled="true"
              onClick={blockClick}
              onKeyDown={blockKeyPress}
              className="h-9 w-9 text-muted-foreground hover:bg-muted"
            >
              <Download className="h-6 w-6" />
            </Button>
          </Tooltip>
          <Button
            asChild
            variant="secondary"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium shadow-none sm:px-4 sm:py-3"
          >
            <Link href="/dashboard/ai-assistant/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading || !userId ? (
          <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
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
          <div className="flex flex-col items-start gap-3 px-4 py-8 sm:px-6">
            <p className="text-sm text-destructive">
              Failed to load chat history.
            </p>
            <Button variant="outline" size="sm" onClick={refreshHistory}>
              Retry
            </Button>
          </div>
        ) : history.length > 0 ? (
          <div className="px-4 pb-8 sm:px-6">
            <ChatHistoryList key={userId} history={history} userId={userId} />
          </div>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}

