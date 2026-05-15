"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Plus, Mic, Send, ImagePlus, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Ask anything about your energy system",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="relative">
      {/* Attach menu */}
      {showAttachMenu && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-48 animate-fade-in z-10">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <ImagePlus className="w-4 h-4 text-gray-500" />
            Add Photo or files
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Camera className="w-4 h-4 text-gray-500" />
            Take a screenshot
          </button>
        </div>
      )}

      <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-gray-300 transition-colors">
        {/* Attach button */}
        <button
          onClick={() => setShowAttachMenu((s) => !s)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mb-0.5"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent leading-relaxed min-h-[24px] max-h-[120px]"
        />

        {/* Mic */}
        <button className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mb-0.5">
          <Mic className="w-4 h-4 text-gray-500" />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all mb-0.5",
            value.trim()
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
