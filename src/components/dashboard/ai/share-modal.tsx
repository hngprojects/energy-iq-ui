"use client";

import { useState, useEffect } from "react";
import { X, Lock, Globe, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle?: string;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [visibility, setVisibility] = useState<"private" | "public">("public");
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://energyiqchat/share/ffuu4jt-4tyh-8ksd";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet — slides from bottom on mobile, centered on desktop */}
      <div
        className={cn(
          "relative bg-white w-full sm:max-w-md sm:mx-4 sm:rounded-2xl shadow-2xl animate-slide-up",
          "rounded-t-2xl sm:rounded-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-4 h-4  text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Share Chat</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Only messages up to this point will be shared
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setVisibility("private")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
                visibility === "private"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Keep private</p>
                <p className="text-xs text-gray-500">Only you have access</p>
              </div>
              {visibility === "private" && (
                <Check className="w-4 h-4 text-gray-900 flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => setVisibility("public")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
                visibility === "public"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-100 hover:border-gray-200"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Create public link</p>
                <p className="text-xs text-gray-500">Anyone can the link can view</p>
              </div>
              {visibility === "public" && (
                <Check className="w-4 h-4 text-gray-900 flex-shrink-0" />
              )}
            </button>
          </div>

          {/* URL row */}
          {visibility === "public" ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2.5 bg-gray-50">
                <span className="text-xs text-gray-500 font-mono break-all">{shareUrl}</span>
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "w-full py-3 text-sm font-semibold transition-all",
                  copied ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCopy}
              className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Copy link
            </button>
          )}
        </div>

        {/* Safe area spacer on mobile */}
        <div className="h-2 sm:hidden" />
      </div>
    </div>
  );
}
