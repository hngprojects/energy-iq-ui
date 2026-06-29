"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

async function resolveShareToken(token: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;
  if (!baseUrl) return null;

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/api/v1/reports/share/${encodeURIComponent(token)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    },
  );

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  const data = payload?.data ?? payload;

  if (typeof data !== "string" || !data) return null;
  return data;
}

export default function ShareTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    resolveShareToken(params.token)
      .then((fileUrl) => {
        if (cancelled) return;

        if (!fileUrl) {
          setStatus("error");
          return;
        }

        window.location.replace(fileUrl);
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [params.token]);

  useEffect(() => {
    if (status === "error") {
      toast.error("Unable to open shared report");
    }
  }, [status]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        Loading shared report...
      </div>
    </div>
  );
}
