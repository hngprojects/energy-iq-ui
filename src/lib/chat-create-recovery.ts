import { chatService } from "@/services/chat-service";
import type { ChatSession } from "@/types/chat";

const RECOVERY_WINDOW_MS = 60_000;

export function createChatRecoveryToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `recovery-${Math.random().toString(36).slice(2)}`;
}

function getChatTime(chat: ChatSession) {
  const value = chat.updatedAt ?? chat.createdAt ?? chat.dateLabel;
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getMessageContent(message: Record<string, unknown>) {
  const content =
    message.content ??
    message.textContent ??
    message.text_content ??
    message.message ??
    message.text;

  return typeof content === "string" ? content.trim() : "";
}

function isUserMessage(message: Record<string, unknown>, userId: string) {
  const role = String(
    message.role ?? message.senderRole ?? message.sender_type ?? "",
  )
    .trim()
    .toLowerCase();

  const senderId =
    message.senderId ?? message.sender_id ?? message.userId ?? message.user_id;

  return role === "user" || senderId === userId;
}

function stashRecoveryAttemptKey(userId: string, token: string) {
  return `chat-create-attempt:${userId}:${token}`;
}

function claimRecoveryChatKey(chatId: string) {
  return `chat-create-claimed:${chatId}`;
}

export function stashChatCreateAttempt(
  userId: string,
  token: string,
  content: string,
  requestedAt: number,
) {
  sessionStorage.setItem(
    stashRecoveryAttemptKey(userId, token),
    JSON.stringify({ content, requestedAt }),
  );
}

export function clearChatCreateAttempt(userId: string, token: string) {
  sessionStorage.removeItem(stashRecoveryAttemptKey(userId, token));
}

function tryClaimRecoveredChat(chatId: string, token: string) {
  const key = claimRecoveryChatKey(chatId);
  const existing = sessionStorage.getItem(key);

  if (existing && existing !== token) {
    return false;
  }

  sessionStorage.setItem(key, token);
  return true;
}

export async function findRecoveredCreatedChat(
  userId: string,
  token: string,
  expectedContent: string,
  requestedAt: number,
): Promise<ChatSession | undefined> {
  const cleanExpected = expectedContent.trim();
  if (!cleanExpected) return undefined;

  const chats = await chatService.getAllChats();
  const candidates = chats
    .filter((chat) => getChatTime(chat) >= requestedAt - RECOVERY_WINDOW_MS)
    .sort((a, b) => getChatTime(b) - getChatTime(a));

  for (const chat of candidates) {
    if (!chat.id) continue;
    if (!tryClaimRecoveredChat(chat.id, token)) continue;

    try {
      const messages = await chatService.getChatMessages(chat.id, userId);
      const records = Array.isArray(messages)
        ? (messages as unknown as Record<string, unknown>[])
        : [];

      const firstUserMessage = records.find((message) =>
        isUserMessage(message, userId),
      );

      if (getMessageContent(firstUserMessage ?? {}) === cleanExpected) {
        return chat;
      }
    } catch {
      // try next candidate
    }

    sessionStorage.removeItem(claimRecoveryChatKey(chat.id));
  }

  return undefined;
}
