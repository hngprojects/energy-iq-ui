"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Download, Plus, MessageSquare } from "lucide-react";
import { ChatItem, FilterTab } from "@/lib/mocks/ai-data";
import { ChatListItem } from "./chat-list-item";
import { groupChatsByDate } from "@/lib/mocks/ai-data";
import { cn } from "@/lib/utils";


const FILTER_TABS: FilterTab[] = ["All", "Solar", "Alerts", "Reports"];

// ─────────────────────────────────────────────────────────────────────────────
// These components MUST live outside ChatList.
// Defining them inside causes React to treat them as new types on every render.
// ─────────────────────────────────────────────────────────────────────────────

interface ToolbarProps {
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
  historyEnabled: boolean;
  onHistoryToggle: () => void;
}

function MobileFilters({
  activeFilter,
  onFilterChange,
  historyEnabled,
  onHistoryToggle,
}: ToolbarProps) {
  return (
    <div className="lg:hidden px-4 pt-4 pb-3 space-y-2 border-b border-gray-100">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={cn(
            "w-full py-3 rounded-xl text-sm font-medium transition-all border",
            activeFilter === tab
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
          )}
        >
          {tab}
        </button>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onHistoryToggle}
          className={cn(
            "p-2.5 rounded-xl border transition-all",
            historyEnabled
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : "bg-white border-gray-200 text-gray-400"
          )}
        >
          <History className="w-4 h-4" />
        </button>
        <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600">
          <Download className="w-4 h-4" />
        </button>
        <Link
          href="/dashboard/ai-assistant/new"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Link>
      </div>
    </div>
  );
}

function DesktopToolbar({
  activeFilter,
  onFilterChange,
  historyEnabled,
  onHistoryToggle,
}: ToolbarProps) {
  return (
    <div className="hidden lg:flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-1.5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilterChange(tab)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
              activeFilter === tab
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onHistoryToggle}
          className={cn(
            "p-2 rounded-lg border transition-all",
            historyEnabled
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : "bg-white border-gray-200 text-gray-400"
          )}
        >
          <History className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" />
        </button>
        <Link
          href="/dashboard/ai-assistant/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface ChatListProps {
  chats: ChatItem[];
  isEmpty?: boolean;
}

export function ChatList({ chats, isEmpty }: ChatListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [historyEnabled, setHistoryEnabled] = useState(true);

  const toolbarProps: ToolbarProps = {
    activeFilter,
    onFilterChange: setActiveFilter,
    historyEnabled,
    onHistoryToggle: () => setHistoryEnabled((h) => !h),
  };

  const filteredChats = chats.filter((chat) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Solar") return chat.tag === "Solar";
    if (activeFilter === "Alerts") return chat.tag === "Alert";
    if (activeFilter === "Reports") return chat.tag === "Report";
    return true;
  });

  const grouped = groupChatsByDate(filteredChats);

  if (isEmpty) {
    return (
      <div className="flex flex-col h-full bg-white">
        <MobileFilters {...toolbarProps} />
        <DesktopToolbar {...toolbarProps} />
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MessageSquare className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
            Your AI assistant chat history will appear here once you start a
            conversation. All interactions are saved automatically.
          </p>
          <Link
            href="/assistant/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start New Conversation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <MobileFilters {...toolbarProps} />
      <DesktopToolbar {...toolbarProps} />
      <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-4 space-y-5">
        {grouped.length === 0 ? (
          <p className="text-center py-12 text-sm text-gray-500">
            No chats found for this filter.
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                {group.label}
              </h2>
              <div className="space-y-2">
                {group.chats.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
