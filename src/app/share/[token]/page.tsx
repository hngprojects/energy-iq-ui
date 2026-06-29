"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reportsService } from "@/services/reports-service";

export default function ShareTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    reportsService
      .getSharedReportFileUrl(params.token)
      .then((fileUrl) => {
        if (cancelled) return;

        if (!fileUrl) {
          toast.error("Unable to open shared report");
          setIsLoading(false);
          return;
        }

        window.location.replace(fileUrl);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Unable to open shared report");
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        {isLoading ? "Loading shared report..." : "Redirecting..."}
      </div>
    </div>
  );
}
