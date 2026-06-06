import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { chatService } from "@/services/chat-service";
import { useAuthStore } from "@/stores/auth-store";
import { ChatMessage, ChatSession } from "@/types/chat";
import { getUserInitials } from "@/lib/user-initials";
import {
  extractCardsFromApiMessage,
  hydrateChatMessagesWithCards,
} from "@/lib/chat-cards-storage";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidChatId(chatId: string) {
  return UUID_REGEX.test(chatId);
}

export function useChatHistory() {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatService.getAllChats();
      setHistory(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch chats"));
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchHistory();
    })();
  }, [fetchHistory]);

  return { history, loading, error, refreshHistory: fetchHistory };
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
  const requestSeqRef = useRef(0);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const userInitials = getUserInitials(user);

  const [chatInfo, setChatInfo] = useState<Partial<ChatSession> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const validChatId = useMemo(() => isValidChatId(chatId), [chatId]);

  const fetchChatDetails = useCallback(async () => {
    const requestSeq = ++requestSeqRef.current;
    if (!validChatId || !userId) {
      setChatInfo(null);
      setMessages([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const [info, msgs] = await Promise.all([
        chatService.getChatById(chatId),
        chatService.getChatMessages(chatId, userId),
      ]);
      if (requestSeq !== requestSeqRef.current) return;

      setChatInfo(info);
      const normalized = Array.isArray(msgs)
        ? (msgs as unknown as Record<string, unknown>[]).map((message) =>
            normalizeChatMessage(message, userId, userInitials),
          )
        : [];

      setMessages(hydrateChatMessagesWithCards(chatId, normalized));
      setError(null);
    } catch (err) {
      if (requestSeq !== requestSeqRef.current) return;
      setChatInfo(null);
      setMessages([]);
      setError(
        err instanceof Error ? err : new Error("Failed to load conversation"),
      );
    } finally {
      if (requestSeq !== requestSeqRef.current) return;
      setLoading(false);
    }
  }, [chatId, userId, userInitials, validChatId]);

  useEffect(() => {
    void (async () => {
      await fetchChatDetails();
    })();
  }, [fetchChatDetails]);

  return {
    chatInfo,
    messages,
    setMessages,
    loading,
    error,
    refreshChat: fetchChatDetails,
    validChatId,
  };
}
