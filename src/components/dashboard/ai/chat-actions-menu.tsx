"use client";

import * as React from "react";
import {
  FolderArchive,
  MoreVertical,
  Pencil,
  Share2,
  ShieldAlert,
  Trash2,
  Globe,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatActionsMenuProps {
  chatId: string;
  triggerClassName?: string;
}

export function ChatActionsMenu({
  chatId,
  triggerClassName,
}: ChatActionsMenuProps) {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [shareMode, setShareMode] = React.useState<"private" | "public">(
    "private",
  );
  const [copied, setCopied] = React.useState(false);

  const shareUrl = `https://energiiqchat/share/ffuu4jt-${chatId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground",
              triggerClassName,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 bg-card border border-border p-1 shadow-md"
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-foreground hover:bg-muted rounded-md"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-foreground hover:bg-muted rounded-md"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-foreground hover:bg-muted rounded-md"
          >
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <span>Pin Chat</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer text-foreground hover:bg-muted rounded-md"
          >
            <FolderArchive className="h-4 w-4 text-muted-foreground" />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer text-destructive hover:bg-destructive/10 rounded-md border-t border-border mt-1 pt-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ─── FIGMA SPEC SHARE DIALOG ─── */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-110 p-6 rounded-2xl border border-border bg-card shadow-lg gap-0">
          <DialogHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
              <Share2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-base font-semibold text-foreground">
                Share Chat
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Only messages up to this point will be shared
              </p>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-3">
            {/* Private Visibility Selector */}
            <div
              onClick={() => setShareMode("private")}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all",
                shareMode === "private"
                  ? "border-border bg-muted/40"
                  : "border-transparent bg-transparent hover:bg-muted/20",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Keep private
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Only you have access
                </p>
              </div>
              {shareMode === "private" && (
                <span className="text-xs font-medium text-foreground self-center">
                  ✓
                </span>
              )}
            </div>

            {/* Public Link Selector */}
            <div
              onClick={() => setShareMode("public")}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all",
                shareMode === "public"
                  ? "border-border bg-muted/40"
                  : "border-transparent bg-transparent hover:bg-muted/20",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Create public link
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Anyone can the link can view
                </p>
              </div>
              {shareMode === "public" && (
                <span className="text-xs font-medium text-foreground self-center">
                  ✓
                </span>
              )}
            </div>
          </div>

          {/* Conditional Copy Actions Wrapper */}
          <div className="pt-4 border-t border-border mt-2">
            {shareMode === "public" ? (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-1.5 pl-3">
                <span className="flex-1 truncate text-xs text-muted-foreground selection:bg-primary/20">
                  {shareUrl}
                </span>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-lg bg-foreground text-background px-4 py-1.5 text-xs font-medium hover:opacity-90 shadow-none border-0 h-8 shrink-0"
                >
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-[11px] text-muted-foreground max-w-65 leading-relaxed">
                  Don&apos;t share personal information or third-party content
                  without permission, and see our Usage Policy.
                </p>
                <Button
                  size="sm"
                  onClick={handleCopy}
                  className="w-full sm:w-auto rounded-lg bg-foreground text-background px-4 py-1.5 text-xs font-medium hover:opacity-90 shadow-none border-0 h-8 shrink-0"
                >
                  {copied ? "Copied!" : "Copy link"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
