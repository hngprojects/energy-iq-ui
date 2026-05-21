// src/types/chat.ts

export interface AlertCard {
  severity: "critical" | "warning" | "info";
  title: string;
  triggeredAt: string;
  status: string;
  details: string;
}

export type ChatRole = "user" | "ai" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  alertCard?: AlertCard;
  userInitials?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  description?: string;
  tag?: "Solar" | "Alert" | "Report";
  dateLabel?: string;
  iconType?: "solar" | "grid" | "default";
  createdAt?: string;
  updatedAt?: string;
  messages?: ChatMessage[];
}

export interface CreateChatPayload {
  startingMessage: string;
}

export interface UpdateChatSettingsPayload {
  chatId: string;
}
