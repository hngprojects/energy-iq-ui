"use client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ChatEmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-22 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <MessageSquare className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-foreground">
          No conversations yet
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your AI assistant chat history will appear here once you start a
          conversation. All interactions are saved automatically.
        </p>
      </div>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => router.push("/dashboard/ai-assistant/new")}
        className="flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        Start New Conversation
      </Button>
    </div>
  );
}
