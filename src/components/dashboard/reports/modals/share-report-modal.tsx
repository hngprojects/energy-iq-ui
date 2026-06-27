"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Link2, Mail, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Report } from "@/lib/mocks/reports-data";
import { reportsService } from "@/services/reports-service";
import { getStatusColors } from "@/constants/reports";
import { useReportShareStore } from "@/stores/report-share-store";

interface ShareReportModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
}

function getFallbackShareUrl(report: Report) {
  return `${window.location.origin}/dashboard/reports/${report.id}`;
}

export function ShareReportModal({
  report,
  open,
  onClose,
}: ShareReportModalProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const link = useReportShareStore((state) =>
    report ? state.getLink(report.id) : undefined,
  );
  const upsertLink = useReportShareStore((state) => state.upsertLink);

  const statusColors = useMemo(() => {
    if (!report) return { bg: "", text: "" };
    return getStatusColors(report.status);
  }, [report]);

  if (!report) return null;

  const generatedUrl = link?.shareUrl ?? "";
  const isReady = report.status?.toUpperCase() === "READY";
  const hasLink = Boolean(generatedUrl);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating share link...");
    try {
      const shareUrl = `${window.location.origin}/reports/public/${report.id}`;
      const expiresAt = new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000,
      ).toISOString();

      upsertLink({
        reportId: report.id,
        shareUrl,
        expiresAt,
        isExpired: false,
      });

      toast.success("Share link generated", { id: toastId });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate share link";
      toast.error(message, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = generatedUrl || getFallbackShareUrl(report);
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleOpenLink = () => {
    const url = generatedUrl || getFallbackShareUrl(report);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = async () => {
    setIsSendingEmail(true);
    const toastId = toast.loading("Sending email report...");
    try {
      await reportsService.emailReport(report.id);
      toast.success("Report email sent successfully!", { id: toastId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send email report";
      console.error(err);
      toast.error(message, { id: toastId });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Here is the report: ${report.title} (${report.subtitle})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg rounded-md border-none bg-card p-0 shadow-2xl"
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
                <p className="text-foreground truncate text-base font-semibold">
                  Share Report
                </p>
                <p className="text-muted-foreground truncate text-sm">
                  Generate a public link, copy it, or open the PDF view.
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
                  <p className="text-foreground truncate text-sm font-semibold">
                    {report.title}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
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

              <div className="mt-4 flex items-center gap-2 text-sm">
                <Link2 className="text-muted-foreground size-4" />
                <span className="text-foreground font-medium">
                  {hasLink ? "Generated link" : "No public link yet"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {!hasLink ? (
                <Button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={!isReady || isGenerating}
                  className="h-12 justify-center rounded-sm bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Link2 className="size-4" />
                  {isGenerating ? "Generating..." : "Generate Link"}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleCopyLink}
                    className="h-12 justify-center rounded-sm bg-black text-white hover:bg-black/90"
                  >
                    <Copy className="size-4" />
                    Copy Link
                  </Button>
                  <Button
                    type="button"
                    onClick={handleOpenLink}
                    className="h-12 justify-center rounded-sm bg-black text-white hover:bg-black/90"
                  >
                    <ExternalLink className="size-4" />
                    Open Link
                  </Button>
                </>
              )}
            </div>

            <div className="border-t border-border pt-5">
              <p className="mb-3 text-sm font-medium text-foreground">
                Share on:
              </p>
              <div className="flex gap-4 w-full flex-col sm:flex-row">
                <Button
                  variant="ghost"
                  onClick={handleShareEmail}
                  disabled={isSendingEmail || !isReady}
                  className="w-full sm:flex-1 h-19.25 flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                  ) : (
                    <Mail className="w-8 h-8 text-(--color-surface-100)" />
                  )}

                  <span className="font-medium text-base text-(--color-surface-100) leading-none">
                    {isSendingEmail ? "Sending..." : "Email"}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleShareWhatsApp}
                  className="w-full sm:flex-1 h-19.25 flex flex-col items-center justify-center rounded-(--radius) p-3 gap-2 border border-(--color-border-disabled) bg-(--color-slate-20) cursor-pointer hover:bg-(--color-slate-30) hover:border-(--color-slate-50) transition-all hover:text-(--color-battery-full)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="var(--color-battery-full)"
                    className="w-8 h-8"
                  >
                    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.477 1.332 4.992L2 22l5.131-1.347c1.455.795 3.097 1.213 4.87 1.213 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm0 18.293c-1.579 0-3.123-.424-4.475-1.226l-.321-.191-3.323.872.887-3.238-.21-.334c-.878-1.401-1.342-3.018-1.342-4.697 0-4.707 3.829-8.536 8.536-8.536 4.707 0 8.536 3.829 8.536 8.536 0 4.707-3.83 8.536-8.536 8.536z" />
                  </svg>

                  <span className="font-medium text-base text-(--color-surface-100) leading-none">
                    WhatsApp
                  </span>
                </Button>
              </div>
            </div>

            {hasLink && link?.expiresAt ? (
              <p className="text-muted-foreground text-xs">
                Expires on {new Date(link.expiresAt).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Free plan links expire after 14 days. Paid plan links can remain
                active.
              </p>
            )}
          </div>
        </div>

        <DialogTitle className="sr-only">Share {report.title}</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
