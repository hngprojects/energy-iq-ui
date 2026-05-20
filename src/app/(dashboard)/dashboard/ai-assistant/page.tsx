import { Download, History, Plus } from "lucide-react";
import Link from "next/link";
import { ChatEmptyState } from "@/components/dashboard/ai/chat-empty-state";
import { ChatHistoryList } from "@/components/dashboard/ai/chat-history-list";

// Replace with a real data fetch when backend is ready
async function getChatHistory() {
  // Return mock – swap out for API call
  return [{ id: "placeholder" }]; // non-empty
  // return []; // empty state
}

export default async function AIAssistantPage() {
  const history = await getChatHistory();
  const hasHistory = history.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div />
        <div className="flex items-center gap-2">
          <button
            title="Chat history"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            title="Download"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
          </button>
          <Link
            href="/dashboard/ai-assistant/new"
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {hasHistory ? (
          <div className="px-6 pb-8">
            <ChatHistoryList />
          </div>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  );
}
