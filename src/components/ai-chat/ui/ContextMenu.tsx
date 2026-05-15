"use client";

import { useEffect, useRef } from "react";
import { Share2, Pen, Pin, Archive, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  onRename: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  className?: string;
}

export function ContextMenu({
  isOpen,
  onClose,
  onShare,
  onRename,
  onPin,
  onArchive,
  onDelete,
  className,
}: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: "Share", icon: Share2, action: onShare, danger: false },
    { label: "Rename", icon: Pen, action: onRename, danger: false },
    { label: "Pin Chat", icon: Pin, action: onPin, danger: false },
    { label: "Archive", icon: Archive, action: onArchive, danger: false },
    { label: "Delete", icon: Trash2, action: onDelete, danger: true },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in",
        className
      )}
    >
      {items.map(({ label, icon: Icon, action, danger }) => (
        <button
          key={label}
          onClick={(e) => {
            e.stopPropagation();
            action();
            onClose();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
            danger
              ? "text-red-500 hover:bg-red-50"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
