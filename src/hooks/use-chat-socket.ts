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

function getSocketUrl() {
  return process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;
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

  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);

  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();

    if (!socketUrl || !chatId || !userId || !token) {
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

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [chatId, token, userId]);

  const sendMessage = useCallback(
    (textContent: string) => {
      const socket = socketRef.current;

      if (!socket || !socket.connected || !userId) {
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
    (callback: (message: NormalizedSystemMessage) => void) => {
      const socket = socketRef.current;

      if (!socket) {
        return () => undefined;
      }

      const handler = (payload: IncomingSystemMessagePayload) => {
        const message = normalizeSystemMessage(payload);

        if (message.chatId && message.chatId !== chatId) {
          return;
        }

        callback(message);
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
    joinActiveChats,
    subscribeToSystemMessages,
  };
}
