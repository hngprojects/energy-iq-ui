import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/services/chat-service";
import { useAuthStore } from "@/stores/auth-store";
import { ChatMessage, ChatSession } from "@/types/chat";
import { getUserInitials } from "@/lib/user-initials";
import {
  extractCardsFromApiMessage,
  hydrateChatMessagesWithCards,
} from "@/lib/chat-cards-storage";
import {
  getFirstUserMessageTitle,
  sanitizeChatTitle,
} from "@/lib/chat-actions-storage";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidChatId(chatId: string) {
  return UUID_REGEX.test(chatId);
}

export function useChatHistory() {
  const userId = useAuthStore((state) => state.user?.id);

  const query = useQuery({
    queryKey: ["chat-history", userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const data = await chatService.getAllChats();
      const chats = Array.isArray(data) ? data : [];
      const chatsNeedingTitle = chats.filter(
        (chat) =>
          !sanitizeChatTitle(chat.title) &&
          !sanitizeChatTitle(chat.description) &&
          !getFirstUserMessageTitle(chat.messages),
      );

      if (!userId || chatsNeedingTitle.length === 0) return chats;

      const messageResults = await Promise.allSettled(
        chatsNeedingTitle.map(async (chat) => ({
          chatId: chat.id,
          messages: await chatService.getChatMessages(chat.id, userId),
        })),
      );

      const messagesByChatId = new Map<string, ChatMessage[]>();
      for (const result of messageResults) {
        if (result.status === "fulfilled") {
          messagesByChatId.set(result.value.chatId, result.value.messages);
        }
      }

      return chats.map((chat) => ({
        ...chat,
        messages: chat.messages ?? messagesByChatId.get(chat.id),
      }));
    },
  });

  return {
    history: query.data ?? [],
    loading: query.isLoading || (!userId && query.fetchStatus !== "idle"),
    error: query.error instanceof Error ? query.error : null,
    refreshHistory: query.refetch,
  };
}

function formatMessageTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function normalizeChatMessage(
  message: Record<string, unknown>,
  currentUserId: string,
  userInitials: string,
): ChatMessage {
  const senderId = getString(
    message.senderId ?? message.sender_id ?? message.userId ?? message.user_id,
  );
  const rawRole = String(
    message.role ?? message.senderRole ?? message.sender_type ?? "",
  ).toLowerCase();

  const role: ChatMessage["role"] =
    rawRole === "user" || senderId === currentUserId
      ? "user"
      : rawRole === "system"
        ? "system"
        : "assistant";

  const content =
    getString(
      message.content ??
        message.textContent ??
        message.text_content ??
        message.message ??
        message.text,
    ) ?? "";

  const cards =
    role === "assistant"
      ? extractCardsFromApiMessage(message)
      : [];

  const shouldTrimLongText =
    cards.length > 0 && content.trim().length > 120;

  return {
    id: getString(message.id) ?? `message-${Date.now()}-${Math.random()}`,
    role,
    content: shouldTrimLongText ? "" : content,
    cards: cards.length > 0 ? cards : undefined,
    timestamp: formatMessageTime(
      getString(
        message.createdAt ??
          message.created_at ??
          message.timestamp ??
          message.updatedAt,
      ),
    ),
    userInitials: role === "user" ? userInitials : undefined,
  };
}

export function useActiveChat(chatId: string) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const userInitials = getUserInitials(user);

  const [chatInfo, setChatInfo] = useState<Partial<ChatSession> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const validChatId = useMemo(() => isValidChatId(chatId), [chatId]);

  const query = useQuery({
    queryKey: ["active-chat", chatId, userId],
    enabled: validChatId && !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      if (!userId) {
        throw new Error("User is required to load chat messages.");
      }

      const [info, msgs] = await Promise.all([
        chatService.getChatById(chatId),
        chatService.getChatMessages(chatId, userId),
      ]);

      const normalized = Array.isArray(msgs)
        ? (msgs as unknown as Record<string, unknown>[]).map((message) =>
            normalizeChatMessage(message, userId, userInitials),
          )
        : [];

      return {
        info,
        messages: hydrateChatMessagesWithCards(chatId, normalized),
      };
    },
  });

  useEffect(() => {
    if (!validChatId || !userId) {
      setChatInfo(null);
      setMessages([]);
      return;
    }

    if (!query.data) return;
    setChatInfo(query.data.info);
    setMessages(query.data.messages);
  }, [query.data, setMessages, userId, validChatId]);

  return {
    chatInfo,
    messages,
    setMessages,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error : null,
    refreshChat: query.refetch,
    validChatId,
  };
}
