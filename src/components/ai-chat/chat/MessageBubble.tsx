import { Message } from "../lib/types";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[80%] lg:max-w-[72%]">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed">
            {message.content}
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right pr-1">
            {message.timestamp}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center flex-shrink-0 mb-5">
          <span className="text-white text-xs font-semibold">AA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-[#EDEDED] flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-[#0B0C0C] text-xs font-bold">AI</span>
      </div>

      <div className="max-w-[80%] lg:max-w-[72%] space-y-1.5">
        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          {message.content && (
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {message.content}
            </p>
          )}

          {/* Alert card */}
          {message.alertCard && (
            <div
              className={cn(
                "mt-2 rounded-xl border p-3",
                message.alertCard.severity === "critical"
                  ? "border-[#8A1010] bg-[#FBFBFB]"
                  : "border-amber-200 bg-amber-50"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle
                  className={cn(
                    "w-3.5 h-3.5 flex-shrink-0",
                    message.alertCard.severity === "critical"
                      ? "text-[#8A1010]"
                      : "text-amber-500"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    message.alertCard.severity === "critical"
                      ? "text-[#8A1010]"
                      : "text-amber-700"
                  )}
                >
                  {message.alertCard.title}
                </span>
              </div>
              <div className="text-sm text-black space-y-0.5 leading-relaxed">
                <p>
                  Triggered: {message.alertCard.triggeredAt} | Status:{" "}
                  {message.alertCard.status}
                </p>
                <p>{message.alertCard.detail}</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 ml-1">{message.timestamp}</p>
      </div>
    </div>
  );
}
