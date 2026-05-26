"use client";

import { Button } from "@/components/ui/button";
import { AlertDetailsCard } from "./alert-details-card";
import { ChatMessage } from "@/types/chat";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}

export function ChatMessageBubble({
  message,
  onRetry,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "ai" || message.role === "assistant";

  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3">
        <div className="flex min-w-0 flex-col items-end gap-1">
          <div className="max-w-sm wrap-break-word whitespace-pre-wrap rounded-2xl rounded-br-sm bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            {message.content}
          </div>

          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-10 text-xs font-semibold text-amber-80">
          {message.userInitials ?? "ME"}
        </div>
      </div>
    );
  }

  if (isAssistant) {
    return (
      <div className="flex w-full items-end justify-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          AI
        </div>

        <div className="flex flex-col gap-1">
          <div className="max-w-md rounded-2xl rounded-bl-sm border border-border bg-card p-4 shadow-sm">
            {message.isStreaming && !message.failed ? (
              <p className="mb-2 text-xs text-muted-foreground">Typing…</p>
            ) : null}

            {message.failed && message.error ? (
              <p className="mb-2 text-sm text-destructive">{message.error}</p>
            ) : null}

            {message.content ? (
              <p className="wrap-break-word whitespace-pre-wrap text-sm text-foreground">
                {message.content}
              </p>
            ) : null}

            {message.alertCard ? (
              <AlertDetailsCard
                severity={message.alertCard.severity}
                title={message.alertCard.title}
                triggeredAt={message.alertCard.triggeredAt}
                status={message.alertCard.status}
                details={message.alertCard.details}
              />
            ) : null}

            {message.failed && onRetry ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onRetry(message.id)}
              >
                Try again
              </Button>
            ) : null}

            <span className="mt-2 block text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
