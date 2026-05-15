import { AlertTriangle, Battery, FileText, Sun } from "lucide-react";
import { ChatItem } from "../lib/types";
import { cn } from "@/lib/utils";

interface ChatIconProps {
  icon: ChatItem["icon"];
  size?: "sm" | "md";
}

const ICON_MAP = {
  "alert-triangle": AlertTriangle,
  "battery-low": Battery,
  "file-text": FileText,
  sun: Sun,
};

const ICON_BG: Record<ChatItem["icon"], string> = {
  "alert-triangle": "bg-[#EDEDED]",
  "battery-low": "bg-[#EDEDED]",
  "file-text": "bg-[#EDEDED]",
  sun: "bg-amber-50",
};

export function ChatIcon({ icon, size = "md" }: ChatIconProps) {
  const Icon = ICON_MAP[icon];
  const bg = ICON_BG[icon];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0",
        bg,
        size === "md" ? "w-10 h-10" : "w-8 h-8"
      )}
    >
      <Icon
        className={cn(
          "text-[#121212]",
          size === "md" ? "w-4.5 h-4.5" : "w-3.5 h-3.5",
          icon === "alert-triangle" && "text-[#121212]"
        )}
        style={{ width: size === "md" ? 18 : 14, height: size === "md" ? 18 : 14 }}
      />
    </div>
  );
}
