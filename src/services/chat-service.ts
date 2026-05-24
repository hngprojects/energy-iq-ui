import { apiFetch } from "@/lib/api/client";
import {
  ChatMessage,
  ChatSession,
  CreateChatPayload,
  UpdateChatSettingsPayload,
} from "@/types/chat";

export const chatService = {
  async createChat(payload: CreateChatPayload): Promise<ChatSession> {
    return apiFetch<ChatSession>("/chats", {
      method: "POST",
      data: payload,
    });
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
