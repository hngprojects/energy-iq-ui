export type ChatTag = "Solar" | "Alert" | "Report";

export interface ChatItem {
  id: string;
  title: string;
  description: string;
  tag: ChatTag;
  timestamp: string;
  date: Date;
  messageCount: number;
  icon: "alert-triangle" | "battery-low" | "file-text" | "sun";
  pinned?: boolean;
  archived?: boolean;
}

export type MessageRole = "user" | "assistant";

export interface AlertCard {
  severity: "critical" | "warning" | "info";
  title: string;
  triggeredAt: string;
  status: string;
  detail: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  alertCard?: AlertCard;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  tag: ChatTag;
  icon: ChatItem["icon"];
}

export type FilterTab = "All" | "Solar" | "Alerts" | "Reports";

export interface GroupedChats {
  label: string;
  chats: ChatItem[];
}
