"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth-store";
import { ChatMessage } from "@/types/chat";

type MessageContentType = "TEXT";

interface SendChatMessagePayload {
  chatId: string;
  contentType: MessageContentType;
  senderId: string;
  textContent: string;
}

interface IncomingSystemMessagePayload {
  id?: string;
  chatId?: string;
  textContent?: string;
  content?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
}

function getSocketUrl() {
  return process.env.NEXT_PUBLIC_CHAT_WS_URL;
}

function formatMessageTime(value?: string) {
  const date = value ? new Date(value) : new Date();

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeSystemMessage(
  payload: IncomingSystemMessagePayload,
): ChatMessage {
  return {
    id: payload.id ?? `system-${Date.now()}`,
    role: "assistant",
    content:
      payload.textContent ??
      payload.content ??
      payload.message ??
      "I received your message, but no response text was returned.",
    timestamp: formatMessageTime(payload.createdAt ?? payload.timestamp),
  };
}

export function useChatSocket(chatId: string) {
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);

  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();

    if (!socketUrl || !chatId || !userId) {
      return;
    }

    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
      query: {
        chatId,
        userId,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setSocketError(null);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      setConnected(false);
      setSocketError(error.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [chatId, token, userId]);

  const sendMessage = useCallback(
    (textContent: string) => {
      const socket = socketRef.current;

      if (!socket || !userId) {
        throw new Error("Chat socket is not connected.");
      }

      const payload: SendChatMessagePayload = {
        chatId,
        contentType: "TEXT",
        senderId: userId,
        textContent,
      };

      socket.emit("send_msg", payload);
    },
    [chatId, userId],
  );

  const onSystemMessage = useCallback(
    (callback: (message: ChatMessage) => void) => {
      const socket = socketRef.current;

      if (!socket) {
        return () => undefined;
      }

      const handler = (payload: IncomingSystemMessagePayload) => {
        if (payload.chatId && payload.chatId !== chatId) return;

        callback(normalizeSystemMessage(payload));
      };

      socket.on("new_system_msg", handler);

      return () => {
        socket.off("new_system_msg", handler);
      };
    },
    [chatId],
  );

  return {
    connected,
    socketError,
    sendMessage,
    onSystemMessage,
  };
}
