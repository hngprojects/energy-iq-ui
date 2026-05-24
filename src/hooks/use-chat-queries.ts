import { useCallback, useEffect, useMemo, useState } from "react";
import { chatService } from "@/services/chat-service";
import { useAuthStore } from "@/stores/auth-store";
import { ChatMessage, ChatSession } from "@/types/chat";

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

export function useActiveChat(chatId: string) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const [chatInfo, setChatInfo] = useState<Partial<ChatSession> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const validChatId = useMemo(() => isValidChatId(chatId), [chatId]);
  const fetchChatDetails = useCallback(async () => {
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
      setChatInfo(info);
      setMessages(Array.isArray(msgs) ? msgs : []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load conversation"),
      );
    } finally {
      setLoading(false);
    }
  }, [chatId, userId, validChatId]);
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
