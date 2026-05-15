"use client";

import { useEffect, useState } from "react";
import { ChevronRight, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestStatus = "idle" | "loading" | "error" | "success";

const LOADING_MESSAGES = [
  "Verifying Credentials and reaching Cloud API",
  "Authenticating Credentials",
  "Fetching Installation data",
  "Request live data",
  "Connection Complete",
];
export const LOADING_TOTAL_MS = 7500;
const MSG_INTERVAL_MS = LOADING_TOTAL_MS / LOADING_MESSAGES.length;

interface TestConnectionStatusProps {
  inverterName: string;
  status: TestStatus;
  onRun: () => void;
}

export function TestConnectionStatus({
  inverterName,
  status,
  onRun,
}: TestConnectionStatusProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (status !== "loading") return;
    const id = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, MSG_INTERVAL_MS);
    return () => {
      clearInterval(id);
      setMsgIndex(0);
    };
  }, [status]);

  const dotClass = cn(
    "size-4 shrink-0 rounded-full",
    status === "error"
      ? "size-2.5 bg-[#C81E1E]"
      : status === "success"
        ? "size-2.5 bg-[#4ADE80]"
        : "bg-[#111827]",
  );

  const label = `Test connection to ${inverterName} VRM`;

  if (status === "success") {
    return (
      <div className="rounded-xl bg-[#E8FFF0] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={dotClass} />
          <span className="text-xs font-semibold text-[#4ADE80]">{label}</span>
        </div>
        <div className="mt-1 h-1 w-full bg-linear-to-r from-[#4ADE80] via-[#DDEFD9] to-[#72B800]" />
        <div className="mt-2 flex items-center gap-2 text-xs text-[#4ADE80]">
          <Check className="size-4" />
          <span>Connection Verified</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl bg-[#FFE8E8] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={dotClass} />
          <span className="text-xs font-semibold text-red-600">{label}</span>
        </div>
        <div className="mt-1 h-1 w-full bg-linear-to-r from-[#4ADE80] via-[#DDEFD9] to-[#72B800]" />
        <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
          <X className="size-4" />
          <span>
            Could not authenticate. Check your credentials and try again.
          </span>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={dotClass} />
            <span className="text-base font-medium text-[#111827]">
              {label}
            </span>
          </div>
          <ChevronRight
            className="size-5 text-[#2A2F3C]"
          />
        </div>
        <div className="mt-2 flex items-center gap-2 pl-4 text-sm text-[#2A2F3C80]">
          <span>{LOADING_MESSAGES[msgIndex]}</span>
          <Loader2
            className="size-4 animate-spin text-black"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onRun}
      className="flex w-full cursor-pointer items-center justify-between gap-2 text-left hover:opacity-90"
    >
      <div className="flex items-center gap-2">
        <span className={dotClass} />
        <span className="text-base font-semibold text-[#2A2F3C] lg:text-lg">
          {label}
        </span>
      </div>
      <ChevronRight
        className="size-5 text-[#2A2F3C]"
      />
    </button>
  );
}
