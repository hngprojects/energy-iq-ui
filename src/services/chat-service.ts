import { apiFetch } from "@/lib/api/client";
import {
  ChatMessage,
  ChatSession,
  CreateChatPayload,
  UpdateChatSettingsPayload,
} from "@/types/chat";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const chatService = {
  async createChat(payload: CreateChatPayload): Promise<ChatSession> {
    const response = await apiFetch<unknown>("/chats", {
      method: "POST",
      data: payload,
    });

    if (!isObject(response)) {
      throw new Error("The chat was created, but no chat id was returned.");
    }

    if ("id" in response) return response as unknown as ChatSession;
    if ("chat" in response)
      return (response as unknown as { chat: ChatSession }).chat;

    if ("data" in response) {
      const data = response.data;
      if (isObject(data)) {
        if ("id" in data) return data as unknown as ChatSession;
        if ("chat" in data)
          return (data as unknown as { chat: ChatSession }).chat;
      }
    }

    throw new Error("The chat was created, but no chat id was returned.");
  },
  async getAllChats(): Promise<ChatSession[]> {
    return apiFetch<ChatSession[]>("/chats", {
      method: "GET",
    });
  },
  async getChatById(id: string): Promise<ChatSession> {
    return apiFetch<ChatSession>(`/chats/${id}`, {
      method: "GET",
    });
  },
  async getChatMessages(id: string, userId: string): Promise<ChatMessage[]> {
    const query = new URLSearchParams({ user_id: userId });
    return apiFetch<ChatMessage[]>(`/chats/${id}/messages?${query}`, {
      method: "GET",
    });
  },
  async updateChatSettings(
    id: string,
    payload: UpdateChatSettingsPayload,
  ): Promise<void> {
    return apiFetch<void>(`/chats/${id}/settings`, {
      method: "PATCH",
      data: payload,
    });
  },
};
