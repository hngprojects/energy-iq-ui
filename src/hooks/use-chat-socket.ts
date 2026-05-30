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
      chat?: { id?: string };
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
      token_chunk?: string;
      stream_end?: boolean;
      text?: string;
      word?: string;
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
      id: `socket-${Date.now()}-${crypto.randomUUID()}`,
      text: payload,
      isChunk: true,
      isFinal: false,
    };
  }

  const chunk =
    payload.token_chunk ??
    payload.delta ??
    payload.token ??
    payload.chunk ??
    payload.word;

  const fullText =
    payload.textContent ??
    payload.content ??
    payload.message ??
    payload.description ??
    payload.text ??
    "";

  // Only treat as chunk when there is actual chunk text
  const hasChunk = typeof chunk === "string" && chunk.length > 0;
  const text = hasChunk ? chunk : fullText;
  const isChunk = hasChunk;

  const hasExplicitFinal =
    Boolean(payload.stream_end) ||
    Boolean(payload.done) ||
    Boolean(payload.final) ||
    Boolean(payload.isFinal) ||
    Boolean(payload.completed);

  const isStreamingPayload = Boolean(chunk);

  const hasCompleteContent =
    !isStreamingPayload && Boolean(fullText || payload.content);
  const isFinalComplete = hasExplicitFinal || hasCompleteContent;

  const resolvedChatId =
    payload.chatId ??
    (typeof payload.chat === "object" && payload.chat !== null
      ? (payload.chat as { id?: string }).id
      : undefined);

  return {
    id: payload.id ?? `socket-${Date.now()}-${crypto.randomUUID()}`,
    chatId: resolvedChatId,
    text,
    isChunk,
    isFinal: isFinalComplete,
    // isFinal: hasExplicitFinal || (!isChunk && text.trim().length > 0),
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
  const tokenRef = useRef(token);
  const userIdRef = useRef(userId);

  // Keep refs in sync without triggering socket recreation
  useEffect(() => {
    tokenRef.current = token;
    userIdRef.current = userId;
  });

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    const socketUrl = getSocketUrl();

    if (!hasHydrated || !userId || !token) return;

    const activeUserId = userId;
    const activeToken = token;

    if (!socketUrl) {
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
        user_id: activeUserId,
      },
      auth: {
        token: withBearer(activeToken),
        Authorization: withBearer(activeToken),
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
      if (!socketRef.current) return;
      setConnected(false);
      setConnecting(false);
      setSocketError(error.message || "Unable to connect to chat.");
    });

    socket.on("error", (error: unknown) => {
      if (typeof error === "string") {
        setSocketError(error);
        return;
      }

      if (error && typeof error === "object") {
        const obj = error as Record<string, unknown>;
        // Match backend format: { code: string, message: string }
        // const code = typeof obj.code === "string" ? obj.code : "";
        const message =
          typeof obj.message === "string"
            ? obj.message
            : typeof obj.code === "string"
              ? obj.code
              : "A chat connection error occurred.";
        setSocketError(message);
        return;
      }

      setSocketError("A chat connection error occurred.");
    });

    socket.on("exception", (data: unknown) => {
      if (typeof data === "string") {
        setSocketError(data);
        return;
      }

      if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const message =
          typeof obj.message === "string"
            ? obj.message
            : "An unexpected error occurred.";
        setSocketError(message);
        return;
      }

      setSocketError("An unexpected error occurred.");
    });

    const handleChatAction = (payload: Record<string, unknown>) => {
      if (payload?.action === "typing") {
        // placeholder for typing indicator if needed later
      }
    };

    const handleTokenChunk = (payload: IncomingPayload) => {
      const message = normalizeIncoming(payload);
      message.isChunk = true;
      message.isFinal = false;
      if (message.chatId && message.chatId !== chatId) return;
      callbacksRef.current.forEach((callback) => callback(message));
    };

    const handleStreamEnd = (payload: IncomingPayload) => {
      const message = normalizeIncoming(payload);
      message.isFinal = true;
      message.isChunk = false;
      if (message.chatId && message.chatId !== chatId) return;
      callbacksRef.current.forEach((callback) => callback(message));
    };

    socket.on("chat_action", handleChatAction);

    socket.on("token_chunk", handleTokenChunk);
    socket.on("stream_end", handleStreamEnd);
    socket.on("new_system_msg", handleMessage);
    socket.on("agent_msg", handleMessage);
    socket.on("receive_msg", handleMessage);
    socket.on("message", handleMessage);

    const thisSocket = socket;

    return () => {
      clearTimeout(connectingTimer);
      clearReconnectTimer();

      thisSocket.off("chat_action", handleChatAction);
      thisSocket.off("token_chunk", handleTokenChunk);
      thisSocket.off("stream_end", handleStreamEnd);
      socket.off("new_system_msg", handleMessage);
      socket.off("agent_msg", handleMessage);
      socket.off("receive_msg", handleMessage);
      socket.off("message", handleMessage);

      thisSocket.off("error");
      thisSocket.off("exception");

      thisSocket.removeAllListeners();
      thisSocket.close();

      if (socketRef.current === thisSocket) {
        socketRef.current = null;
      }
      setConnected(false);
      setConnecting(false);
      setSocketError(null);
    };
  }, [chatId, hasHydrated, userId, token]);

  const sendMessage = useCallback(
    (textContent: string) => {
      const socket = socketRef.current;
      const activeUserId = userIdRef.current;

      if (!activeUserId) {
        throw new Error("User is not available for chat.");
      }

      if (!socket || !socket.connected) {
        throw new Error("Chat socket is not connected.");
      }

      // Read saved session ID from localStorage
      let sessionId: string | null = null;
      try {
        sessionId = localStorage.getItem(`chat-session:${chatId}`);
      } catch {
        // localStorage unavailable
      }

      socket.emit("send_msg", {
        chatId,
        contentType: "TEXT",
        senderId: activeUserId,
        textContent,
        ...(sessionId ? { sessionId } : {}),
      });
    },
    [chatId],
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
