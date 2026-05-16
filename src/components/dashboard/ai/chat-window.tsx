"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, MoreVertical } from "lucide-react";
import { ChatConversation, Message } from "@/lib/mocks/ai-data";
import { ChatIcon } from "@/components/dashboard/ai/chat-icon";
import { MessageBubble } from "@/components/dashboard/ai/message-bubble";
import { ChatInput } from "@/components/dashboard/ai/chat-input";
import { ContextMenu } from "@/components/dashboard/ai/context-menu";
import { ShareModal } from "@/components/dashboard/ai/share-modal";

interface ChatWindowProps {
  conversation: ChatConversation;
}

export function ChatWindow({ conversation }: ChatWindowProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (content: string) => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();

    const userMsg: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1500));
    setIsTyping(false);

    const aiMsg: Message = {
      id: `m${Date.now() + 1}`,
      role: "assistant",
      content:
        "Based on your energy data, the system is stabilizing. Solar input is recovering and battery should reach ~40% within 2 hours if conditions remain stable.",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).toLowerCase(),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Chat header ───────────────────────────── */}
      <div className="flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-0 lg:h-16 bg-white border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <ChatIcon icon={conversation.icon} size="sm" />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {conversation.title}
          </h1>
          <p className="text-xs text-gray-400 leading-tight">
            Today, 6:10 am · {messages.length} messages
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* Download — hidden on small mobile */}
          <button className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4 text-gray-500" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            <ContextMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onShare={() => { setShareOpen(true); setMenuOpen(false); }}
              onRename={() => {}}
              onPin={() => {}}
              onArchive={() => {}}
              onDelete={() => {}}
              className="right-0 top-10"
            />
          </div>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4 bg-gray-50/30">
        {/* Date divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 text-xs font-bold">AI</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ─────────────────────────────── */}
      <div className="px-4 lg:px-6 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        chatTitle={conversation.title}
      />
    </div>
  );
}
