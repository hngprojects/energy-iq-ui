"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Report } from "@/lib/mocks/reports-data";
import { reportsService } from "@/services/reports-service";
import { getStatusColors } from "@/constants/reports";
import { useReportShareStore } from "@/stores/report-share-store";
import { cn } from "@/lib/utils";

interface ShareReportModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

function formatRemainingDays(expiresAt?: string) {
  if (!expiresAt) return 14;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTokenFromShareUrl(shareUrl: string): string | null {
  const match = shareUrl.match(/\/share\/([^/?#]+)/);
  return match?.[1] ?? null;
}

function SharePlatformIcon({
  platform,
}: {
  platform: "whatsapp" | "email" | "telegram" | "facebook" | "share";
}) {
  if (platform === "share") {
    return <Share2 className="size-4" />;
  }

  if (platform === "email") {
    return (
      <svg viewBox="0 0 24 24" className="size-10" aria-hidden="true">
        <rect width="24" height="24" rx="12" fill="#111827" />
        <path
          d="M6 8.5h12v7H6v-7Zm1.2.9L12 13l4.8-3.6"
          fill="none"
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (platform === "telegram") {
    return (
      <svg viewBox="0 0 24 24" className="size-10" aria-hidden="true">
        <rect width="24" height="24" rx="12" fill="#229ED9" />
        <path
          d="M6.7 12.1 17 7.6l-1.6 8.4c-.1.4-.5.6-.9.4l-3-2.2-1.8 1.7c-.2.2-.6.2-.8 0l.3-2.4 6.1-5.5-7.5 4.7c-.3.2-.6.1-.7-.2-.1-.3 0-.6.3-.7Z"
          fill="#fff"
        />
      </svg>
    );
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-10" aria-hidden="true">
        <rect width="24" height="24" rx="12" fill="#1877F2" />
        <path
          d="M13.1 20v-6.2h2.1l.3-2.4h-2.4V9.8c0-.7.2-1.1 1.1-1.1h1.3V6.5c-.6-.1-1.3-.2-2.1-.2-2 0-3.4 1.2-3.4 3.4v1.7H8.1v2.4h1.8V20h3.2Z"
          fill="#fff"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-10" aria-hidden="true">
      <rect width="24" height="24" rx="12" fill="#25D366" />
      <path
        d="M12 6.2a5.8 5.8 0 0 0-5 8.8L6 19l4.1-1a5.8 5.8 0 1 0 1.9-11.8Zm2.9 8.3c-.1.3-.7.6-1 .7-.3.1-.6.1-1-.1-.3-.1-.8-.3-1.5-.8-1.2-.8-2-1.9-2.2-2.1-.2-.2-1-1.4-1-2.7 0-.8.4-1.2.6-1.4.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .4.3.1.3.5 1.1.6 1.2.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.1.1-.2.3-.1.5.1.2.4.8 1 1.3.8.7 1.4 1 1.6 1.1.2.1.3.1.4-.1.1-.2.6-.7.8-1 .2-.2.3-.2.5-.1.2.1 1.1.5 1.2.6.2.1.4.1.5.2.1 0 .1.3 0 .6Z"
        fill="#fff"
      />
    </svg>
  );
}

function ShareTargetButton({
  label,
  platform,
  onClick,
}: {
  label: string;
  platform: "whatsapp" | "email" | "telegram" | "facebook" | "share";
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background p-2 hover:bg-muted"
      aria-label={label}
    >
      <SharePlatformIcon platform={platform} />
      <span className="text-[10px] font-medium leading-none text-foreground">
        {label}
      </span>
    </Button>
  );
}

export function ShareReportModal({ report, open, onClose }: ShareReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const link = useReportShareStore((state) =>
    report ? state.getLink(report.id) : undefined,
  );
  const upsertLink = useReportShareStore((state) => state.upsertLink);

  const statusColors = useMemo(() => {
    if (!report) return { bg: "", text: "" };
    return getStatusColors(report.status);
  }, [report]);

  useEffect(() => {
    if (!report || !open || link?.shareUrl) return;

    let cancelled = false;
    reportsService
      .getShareableLink(report.id)
      .then((shareUrl) => {
        if (cancelled || !shareUrl) return;
        upsertLink({
          reportId: report.id,
          shareUrl,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          isExpired: false,
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [link?.shareUrl, open, report, upsertLink]);

  if (!report) return null;

  const shareUrl = link?.shareUrl ?? "";
  const hasLink = Boolean(shareUrl);
  const isReady = report.status?.toUpperCase() === "READY";
  const remainingDays = formatRemainingDays(link?.expiresAt);
  const previewLabel = hasLink ? shareUrl : "Create share link";
  const expiryText = `Generated link will expire in ${remainingDays} day${remainingDays === 1 ? "" : "s"}`;

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating share link...");

    try {
      const generatedUrl = await reportsService.generateShareableLink(report.id);
      upsertLink({
        reportId: report.id,
        shareUrl: generatedUrl,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
      });
      toast.success("Link generated successfully", { id: toastId });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate share link";
      toast.error(message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPreviewLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareFile = async () => {
    if (!shareUrl || !navigator.share) return;

    const token = getTokenFromShareUrl(shareUrl);
    if (!token) return;

    try {
      const fileUrl = await reportsService.getSharedReportFileUrl(token);
      if (!fileUrl) return;

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const file = new File([blob], `${report.title}.pdf`, {
        type: blob.type || "application/pdf",
      });

      const canShareFile = navigator.canShare?.({ files: [file] });
      if (canShareFile) {
        await navigator.share({
          title: report.title,
          text: `Energy Report for ${report.title}`,
          files: [file],
        });
        return;
      }

      await navigator.share({
        title: report.title,
        text: `Energy Report for ${report.title}`,
        url: shareUrl,
      });
    } catch {
      // user cancelled or platform does not support the call cleanly
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="rounded-md border-none bg-card p-0 shadow-2xl sm:max-w-lg"
      >
        <div className="flex max-h-[90vh] flex-col overflow-hidden">
          <div className="flex items-start justify-between border-b border-border px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="text-white flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-border-disabled)" }}
              >
                <Share2 className="size-4 text-black" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">
                  Share Report
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Generate a preview link and share it safely.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="rounded-sm border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {report.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {report.subtitle}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: statusColors.text }}
                  />
                  {report.status?.charAt(0).toUpperCase() +
                    report.status?.slice(1).toLowerCase()}
                </span>
              </div>
            </div>

            {!hasLink ? (
              <Button
                type="button"
                onClick={handleGenerateLink}
                disabled={!isReady || isGenerating}
                className={cn(
                  "h-12 w-full justify-center rounded-sm bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50",
                  !isReady && "opacity-60",
                )}
              >
                <Link2 className="size-4" />
                {isGenerating ? "Generating share link..." : "Generate share link"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-sm border border-border bg-muted/30 px-4 py-3">
                  <p className="min-w-0 truncate text-sm text-foreground">
                    {previewLabel}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPreviewLink}
                    className="h-8 shrink-0 px-3 text-sm"
                  >
                    <Copy className="size-3.5" />
                    Copy link
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ShareTargetButton label="WhatsApp" platform="whatsapp" onClick={handleShareFile} />
                  <ShareTargetButton label="Email" platform="email" onClick={handleShareFile} />
                  <ShareTargetButton label="Telegram" platform="telegram" onClick={handleShareFile} />
                  <ShareTargetButton label="Facebook" platform="facebook" onClick={handleShareFile} />
                  <ShareTargetButton label="Share" platform="share" onClick={handleShareFile} />
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{expiryText}</p>
          </div>
        </div>

        <DialogTitle className="sr-only">Share {report.title}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
