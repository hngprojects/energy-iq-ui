"use client";

import * as React from "react";
import {
  FolderArchive,
  Globe,
  MoreVertical,
  Pencil,
  Pin,
  Share2,
  Shield,
  Trash2,
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
  title?: string;
  triggerClassName?: string;
  onRename?: (chatId: string, title: string) => void;
  onPin?: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
  onDelete?: (chatId: string) => void;
}

export function ChatActionsMenu({
  chatId,
  title,
  triggerClassName,
  onRename,
  onPin,
  onArchive,
  onDelete,
}: ChatActionsMenuProps) {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [shareMode, setShareMode] = React.useState<"private" | "public">(
    "private",
  );
  const [copied, setCopied] = React.useState(false);

  const shareUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/dashboard/ai-assistant/${chatId}`;
  }, [chatId]);

  const stopMenuEvent = (
    event: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy chat link:", err);
    }
  };

  const handleRename = () => {
    const nextTitle = window.prompt("Rename chat", title ?? "");
    const cleanTitle = nextTitle?.trim();

    if (cleanTitle) {
      onRename?.(chatId, cleanTitle);
    }
  };

  const handleConfirmDelete = () => {
    onDelete?.(chatId);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open chat actions"
            className={cn(
              "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground",
              triggerClassName,
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40 border border-border bg-card p-1 shadow-md"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <DropdownMenuItem
            onClick={(event) => {
              stopMenuEvent(event);
              window.setTimeout(() => setIsShareOpen(true), 0);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(event) => {
              stopMenuEvent(event);
              handleRename();
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(event) => {
              stopMenuEvent(event);
              onPin?.(chatId);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <Pin className="h-4 w-4" />
            Pin Chat
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(event) => {
              stopMenuEvent(event);
              onArchive?.(chatId);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
          >
            <FolderArchive className="h-4 w-4" />
            Archive
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(event) => {
              stopMenuEvent(event);
              window.setTimeout(() => setIsDeleteOpen(true), 0);
            }}
            className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent
          className="sm:max-w-110 max-w-[90vw] overflow-hidden p-6 rounded-2xl border border-border bg-card shadow-lg gap-0"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
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
                  Anyone with the link can view
                </p>
              </div>
              {shareMode === "public" && (
                <span className="text-xs font-medium text-foreground self-center">
                  ✓
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-2 w-full max-w-full overflow-hidden">
            {shareMode === "public" ? (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-1.5 pl-3 w-full max-w-full overflow-hidden">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <span className="block truncate break-all text-xs text-muted-foreground selection:bg-primary/20">
                    {shareUrl}
                  </span>
                </div>
                <Button
                  type="button"
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
                  type="button"
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

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent
          className="sm:max-w-110 max-w-[90vw] overflow-hidden p-6 rounded-2xl border border-border bg-card shadow-lg gap-0"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <DialogHeader className="flex flex-row items-start gap-3 space-y-0 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-red-500">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-base font-semibold text-foreground">
                Delete Chat
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                This conversation will be removed from your chat history.
              </p>
            </div>
          </DialogHeader>

          <div className="pt-4 border-t border-border mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-lg px-4 py-1.5 text-xs font-medium shadow-none border-0 h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmDelete}
              className="rounded-lg bg-red-500 text-white px-4 py-1.5 text-xs font-medium hover:opacity-90 shadow-none border-0 h-8 shrink-0"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
