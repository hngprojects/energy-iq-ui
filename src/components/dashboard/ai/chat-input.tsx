"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Plus, Mic, Send, ImagePlus, Camera } from "lucide-react";

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
    <div className="relative flex flex-col items-center ">

      <div className=" relative flex items-center bg-white border border-[#E8E8E8] rounded-[8px] w-full px-[24px] py-[20px]  focus-within:border-gray-300 transition-colors">
        {/* Attach button */}
        <button
          onClick={() => setShowAttachMenu((s) => !s)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mb-0.5"
        >
          <Plus className="w-3 h-3 text-[#121212]" />
        </button>

        {/* Attach menu */}
        {showAttachMenu && (
          <div className="absolute bottom-12 left-0 mb-2 bg-white rounded-[8px] shadow-lg border border-[#E8E8E8]  w-[185px] animate-fade-in z-10">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#404040] border-b hover:bg-gray-50 transition-colors">
              <ImagePlus className="w-[20px] h-[20px] text-[#141414]" />
              Add Photo or files
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#404040] hover:bg-gray-50 transition-colors">
              <Camera className="w-[20px] h-[20px] text-[#141414]" />
              Take a screenshot
            </button>
          </div>
        )}

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
          className="flex-1 resize-none text-base font-medium text-gray-800 placeholder:text-[#9CA3AF] focus:outline-none bg-transparent  min-h-[24px] max-h-[120px]"
        />

        {/* Mic */}
        <div className="gap-[24px] flex items-center">
          <button className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mb-0.5">
            <Mic className="w-4 h-4 text-[#121212]" />
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className={
              "flex-shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center transition-all  bg-[#121212] text-white hover:bg-gray-700"
            }
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
