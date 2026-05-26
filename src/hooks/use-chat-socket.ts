"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/auth-store";

type IncomingPayload =
  | string
  | {
      id?: string;
      chatId?: string;
      textContent?: string;
      content?: string;
      message?: string;
      description?: string;
      action?: string;
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

interface NormalizedMessage {
  id: string;
  chatId?: string;
  text: string;
  isChunk: boolean;
  isFinal: boolean;
  sessionId?: string;
  timestamp?: string;
}

type MessageCallback = (message: NormalizedMessage) => void;

function getSocketUrl() {
  return process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;
}

function withBearer(token: string) {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

function normalizeIncoming(payload: IncomingPayload): NormalizedMessage {
  if (typeof payload === "string") {
    return {
      id: `socket-${Date.now()}`,
      text: payload,
      isChunk: true,
      isFinal: false,
    };
  }

  const chunk = payload.delta ?? payload.token ?? payload.chunk;
  const fullText =
    payload.textContent ??
    payload.content ??
    payload.message ??
    payload.description ??
    "";

  const isChunk = typeof chunk === "string";

  return {
    id: payload.id ?? `socket-${Date.now()}`,
    chatId: payload.chatId,
    text: chunk ?? fullText,
    isChunk,
    isFinal:
      Boolean(payload.done) ||
      Boolean(payload.final) ||
      Boolean(payload.isFinal) ||
      Boolean(payload.completed),
    sessionId: payload.sessionId,
    timestamp: payload.createdAt ?? payload.timestamp,
  };
}

export function useChatSocket(chatId: string) {
  const userId = useAuthStore((state) => state.user?.id);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<Set<MessageCallback>>(new Set());

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();

    if (!hasHydrated) return;

    if (!socketUrl || !userId || !token) {
      const timer = setTimeout(() => {
        setConnecting(false);
        setSocketError("Chat connection is missing authentication details.");
      }, 0);
      return () => clearTimeout(timer);
    }

    const connectingTimer = setTimeout(() => {
      setConnecting(true);
    }, 0);

    const socket = io(socketUrl, {
      query: {
        user_id: userId,
      },
      auth: {
        token: withBearer(token),
        Authorization: withBearer(token),
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const clearReconnectTimer = () => {
      if (!reconnectTimer) return;
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    };

    const handleMessage = (payload: IncomingPayload) => {
      const message = normalizeIncoming(payload);

      if (message.chatId && message.chatId !== chatId) return;

      callbacksRef.current.forEach((callback) => callback(message));
    };

    socket.on("connect", () => {
      clearReconnectTimer();
      setConnected(true);
      setConnecting(false);
      setSocketError(null);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);

      if (reason === "io server disconnect") {
        setConnecting(true);
        reconnectTimer = setTimeout(() => {
          socket.connect();
        }, 500);
        return;
      }

      setConnecting(socket.active);
    });

    socket.on("connect_error", (error) => {
      setConnected(false);
      setConnecting(false);
      setSocketError(error.message || "Unable to connect to chat.");
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

    socket.on("chat_action", handleMessage);
    socket.on("new_system_msg", handleMessage);
    socket.on("agent_msg", handleMessage);
    socket.on("receive_msg", handleMessage);
    socket.on("message", handleMessage);

    return () => {
      clearTimeout(connectingTimer);
      clearReconnectTimer();

      socket.off("chat_action", handleMessage);
      socket.off("new_system_msg", handleMessage);
      socket.off("agent_msg", handleMessage);
      socket.off("receive_msg", handleMessage);
      socket.off("message", handleMessage);

      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setConnecting(false);
      setSocketError(null);
    };
  }, [chatId, hasHydrated, token, userId]);

  const sendMessage = useCallback(
    (textContent: string, sessionId?: string) => {
      const socket = socketRef.current;

      if (!userId) {
        throw new Error("User is not available for chat.");
      }

      if (!socket || !socket.connected) {
        throw new Error("Chat socket is not connected.");
      }

      const storedSessionId =
        sessionId ??
        (typeof window !== "undefined"
          ? localStorage.getItem(`chat-session:${chatId}`)
          : null);

      socket.emit("send_msg", {
        chatId,
        contentType: "TEXT",
        senderId: userId,
        textContent,
        ...(storedSessionId ? { sessionId: storedSessionId } : {}),
      });
    },
    [chatId, userId],
  );

  const joinActiveChats = useCallback(() => {
    const socket = socketRef.current;

    if (!socket || !socket.connected || !userId) return;

    socket.emit("join_active_chats", {
      userId,
    });
  }, [userId]);

  const subscribeToSystemMessages = useCallback((callback: MessageCallback) => {
    callbacksRef.current.add(callback);

    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);

  return {
    connected,
    connecting,
    socketError,
    sendMessage,
    joinActiveChats,
    subscribeToSystemMessages,
  };
}
