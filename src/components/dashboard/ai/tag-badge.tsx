import { cn } from "@/lib/utils";
import { ChatTag } from "@/lib/mocks/ai-data";

interface TagBadgeProps {
  tag: ChatTag;
  className?: string;
}

const TAG_STYLES: Record<ChatTag, string> = {
  Solar:
    "bg-[#DFFFEB] text-[#17cc41] ",
  Alert:
    "bg-[#FFE6E8] text-[#C81E1E] ",
  Report:
    "bg-[#F5F5F5] text-[#666666] ",
};

export function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        TAG_STYLES[tag],
        className
      )}
    >
      {tag}
    </span>
  );
}
