"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth-store";

type MessageContentType = "TEXT";

interface SendChatMessagePayload {
  chatId: string;
  senderId: string;
  contentType: MessageContentType;
  textContent: string;
}

type IncomingSystemMessagePayload =
  | string
  | {
      id?: string;
      chatId?: string;
      textContent?: string;
      content?: string;
      message?: string;
      token?: string;
      delta?: string;
      chunk?: string;
      done?: boolean;
      final?: boolean;
      isFinal?: boolean;
      completed?: boolean;
      sessionId?: string;
      createdAt?: string;
      timestamp?: string;
    };

interface NormalizedSystemMessage {
  id: string;
  chatId?: string;
  text: string;
  isChunk: boolean;
  isFinal: boolean;
  sessionId?: string;
  timestamp?: string;
}

type SystemMessageCallback = (message: NormalizedSystemMessage) => void;

function getSocketUrl() {
  return (
    process.env.NEXT_PUBLIC_CHAT_SOCKET_URL ||
    process.env.NEXT_PUBLIC_CHAT_WS_URL
  );
}

function normalizeSystemMessage(
  payload: IncomingSystemMessagePayload,
): NormalizedSystemMessage {
  if (typeof payload === "string") {
    return {
      id: `system-${Date.now()}`,
      text: payload,
      isChunk: true,
      isFinal: false,
    };
  }

  const chunk = payload.delta ?? payload.token ?? payload.chunk;
  const fullText = payload.textContent ?? payload.content ?? payload.message;
  const isChunk = typeof chunk === "string";
  const text = chunk ?? fullText ?? "";

  return {
    id: payload.id ?? `system-${Date.now()}`,
    chatId: payload.chatId,
    text,
    isChunk,
    isFinal:
      Boolean(payload.done) ||
      Boolean(payload.final) ||
      Boolean(payload.isFinal) ||
      Boolean(payload.completed) ||
      (!isChunk && Boolean(fullText)),
    sessionId: payload.sessionId,
    timestamp: payload.createdAt ?? payload.timestamp,
  };
}

export function useChatSocket(chatId: string) {
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Set<SystemMessageCallback>>(new Set());

  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();

    if (!hasHydrated || !socketUrl || !chatId || !userId || !token) {
      return;
    }

    const socket = io(socketUrl, {
      transports: ["websocket"],
      auth: {
        token,
      },
      query: {
        userId,
        chatId,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const handleSystemMessage = (payload: IncomingSystemMessagePayload) => {
      const message = normalizeSystemMessage(payload);

      if (message.chatId && message.chatId !== chatId) {
        return;
      }

      callbacksRef.current.forEach((callback) => callback(message));
    };

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

    socket.on("error", (error) => {
      if (typeof error === "string") {
        setSocketError(error);
        return;
      }

      if (error && typeof error === "object" && "message" in error) {
        setSocketError(String(error.message));
        return;
      }

      setSocketError("A chat connection error occurred.");
    });

    socket.on("new_system_msg", handleSystemMessage);

    return () => {
      socket.off("new_system_msg", handleSystemMessage);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setSocketError(null);
    };
  }, [chatId, hasHydrated, token, userId]);

  const sendMessage = useCallback(
    (textContent: string) => {
      const socket = socketRef.current;

      if (!userId) {
        throw new Error("User is not available for chat.");
      }

      if (!socket || !socket.connected) {
        throw new Error("Chat socket is not connected.");
      }

      const payload: SendChatMessagePayload = {
        chatId,
        senderId: userId,
        contentType: "TEXT",
        textContent,
      };

      socket.emit("send_msg", payload);
    },
    [chatId, userId],
  );

  const joinActiveChats = useCallback(() => {
    const socket = socketRef.current;

    if (!socket || !socket.connected || !userId) {
      return;
    }

    socket.emit("join_active_chats", {
      userId,
    });
  }, [userId]);

  const subscribeToSystemMessages = useCallback(
    (callback: SystemMessageCallback) => {
      callbacksRef.current.add(callback);

      return () => {
        callbacksRef.current.delete(callback);
      };
    },
    [],
  );

  return {
    connected,
    socketError,
    sendMessage,
    joinActiveChats,
    subscribeToSystemMessages,
  };
}
