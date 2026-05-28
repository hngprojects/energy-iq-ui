export interface AlertCard {
  severity: "critical" | "warning" | "info";
  title: string;
  triggeredAt: string;
  status: string;
  details: string;
}

export type ChatRole = "user" | "ai" | "assistant" | "system";

export type AiResponseCardType =
  | "summary"
  | "insight"
  | "anomaly"
  | "recommendation"
  | "alert";

export interface AiResponseCard {
  type: AiResponseCardType;
  headline: string;
  description: string;
  severity?: "critical" | "warning" | "info";
  dataPoint?: string;
  actionLabel?: string;
  cards?: AiResponseCard[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  alertCard?: AlertCard;
  userInitials?: string;
  isStreaming?: boolean;
  error?: string;
  failed?: boolean;
  cards?: AiResponseCard[];
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

export type MessageContentType = "TEXT";

export interface SendChatMessagePayload {
  chatId: string;
  senderId: string;
  contentType: MessageContentType;
  textContent: string;
}

export interface IncomingSystemMessagePayload {
  id?: string;
  chatId?: string;
  textContent?: string;
  content?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  sessionId?: string;
}
