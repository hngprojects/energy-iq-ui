"use client";

import { AlertDetailsCard } from "./alert-details-card";

interface AlertCard {
  severity: "critical" | "warning" | "info";

  title: string;

  triggeredAt: string;

  status: string;

  details: string;
}

interface ChatMessage {
  id: string;

  role: "user" | "ai";

  content: string;

  timestamp: string;

  alertCard?: AlertCard;

  userInitials?: string;
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3">
        <div className="flex flex-col items-end gap-1">
          <div className="max-w-sm rounded-2xl rounded-br-sm bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            {message.content}
          </div>

          <span className="text-xs text-muted-foreground">
            {message.timestamp}
          </span>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-10 text-xs font-semibold text-amber-80">
          {message.userInitials ?? "AA"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-start gap-3 w-full">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        AI
      </div>

      <div className="flex flex-col gap-1">
        {message.alertCard ? (
          <div className="max-w-md rounded-2xl rounded-bl-sm border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm text-foreground">{message.content}</p>

            <AlertDetailsCard
              severity={message.alertCard.severity}
              title={message.alertCard.title}
              triggeredAt={message.alertCard.triggeredAt}
              status={message.alertCard.status}
              details={message.alertCard.details}
            />

            <span className="mt-2 block text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
        ) : (
          <div className="max-w-md rounded-2xl rounded-bl-sm border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-foreground">{message.content}</p>

            <span className="mt-2 block text-xs text-muted-foreground">
              {message.timestamp}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
