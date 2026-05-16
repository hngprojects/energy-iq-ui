"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { ChatItem } from "@/lib/mocks/ai-data";
import { TagBadge } from "./TagBadge";
import { ChatIcon } from "./ChatIcon";
import { ContextMenu } from "./ContextMenu";
import { ShareModal } from "./ShareModal";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  chat: ChatItem;
}

export function ChatListItem({ chat }: ChatListItemProps) {

   const [isActive, setIsActive] = useState(false); 

  const handleClick = () => {
    // Add your click event handler logic here
    setIsActive(!isActive);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "group  border-b last:border-b-0 flex justify-between ",
          isActive
            ? "border border-[#F5F5F5] bg-[#F5F5F5] "
            : "border-gray-100 bg-white hover:border-gray-200 "
        )}
        
        onClick={handleClick}
      >
        {/*  <Link href={`/assistant/${chat.id}`} className="block p-4">*/}
        <div className="flex items-start gap-3 block p-4">
          <ChatIcon icon={chat.icon} />

          <div className="flex-1 min-w-0 gap-[12px]">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
              {chat.title}
            </h3>
            <p className="text-sm text-[#666666]  leading-relaxed line-clamp-2">
              {chat.description}
            </p>
            <div className="mt-2">
              <TagBadge tag={chat.tag} />
            </div>
          </div>
        </div>
        {/*</Link>*/}

        {/* Timestamp + 3-dot row */}
        <div className="flex items-center justify-between px-4 pb-3 -mt-1">
          <span className="text-xs text-gray-400">{chat.timestamp}</span>
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className={cn(
                "p-1.5 rounded-lg transition-all",

                menuOpen ? "bg-gray-100 opacity-100" : "hover:bg-gray-100"
              )}
            >
              <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <ContextMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              onShare={() => { setShareOpen(true); setMenuOpen(false); }}
              onRename={() => { }}
              onPin={() => { }}
              onArchive={() => { }}
              onDelete={() => { }}
              className="right-0 bottom-8"
            />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        chatTitle={chat.title}
      />
    </>
  );
}
