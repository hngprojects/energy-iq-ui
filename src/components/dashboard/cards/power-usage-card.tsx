"use client";

import { useState } from "react";
import { Sun, Snowflake, Lightbulb, Flame, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const icons = [Snowflake, Snowflake, Lightbulb, Flame];

type Zone = { name: string; pct: number; watts: number };

function PowerBreakdownModal({
  open,
  onOpenChange,
  totalKw,
  zones,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  totalKw: number;
  zones: Zone[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-w-157.5 sm:h-138.25">
        {/* Header */}
        <DialogHeader className="border-border shrink-0 border-b px-6 pt-6 pb-5">
          <DialogTitle className="text-lg font-bold">
            Power breakdown
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            What each part of your shop is using right now
          </p>
        </DialogHeader>

        {/* Total row */}
        <div className="shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-baseline justify-between">
            <p className="text-foreground text-4xl font-bold tracking-tight">
              {totalKw}
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                kW running now
              </span>
            </p>
            <span className="text-muted-foreground text-sm">
              Across {zones.length} zones
            </span>
          </div>
        </div>

        {/* Zones */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-4">
          {zones.map((zone, i) => {
            const Icon = icons[i] ?? Sun;
            const isFirst = i === 0;
            return (
              <div key={zone.name} className="space-y-2.5">
                {/* Name + watts row */}
                <div className="flex items-center gap-3">
                  <div className="border-border bg-card flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                    <Icon className="text-foreground h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm font-medium">
                    {zone.name}
                  </span>
                  <span className="text-foreground text-sm tabular-nums">
                    <span className="font-bold">{zone.watts}</span>
                    {" W"}
                  </span>
                </div>
                {/* Bar + pct row */}
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      style={{ "--w": `${zone.pct}%` } as React.CSSProperties}
                      className={
                        isFirst
                          ? "bg-secondary h-full w-(--w) rounded-full"
                          : "bg-foreground h-full w-(--w) rounded-full"
                      }
                    />
                  </div>
                  <span className="text-muted-foreground w-9 text-right text-sm tabular-nums">
                    {zone.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-border shrink-0 border-t px-6 py-4">
          <p className="text-muted-foreground text-sm">
            Compared to same time yesterday
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PowerUsageCard({ zones }: { zones: Zone[] }) {
  const [open, setOpen] = useState(false);
  const previewZones = zones.slice(0, 3);
  const totalKw = +(zones.reduce((sum, z) => sum + z.watts, 0) / 1000).toFixed(
    1,
  );

  return (
    <>
      <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Where your power&apos;s going</p>
          <span className="bg-chart-battery text-success-alt inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium">
            <span className="bg-success-alt h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
            Live
          </span>
        </div>
        <div className="space-y-3">
          {previewZones.map((z, i) => {
            const Icon = icons[i] ?? Sun;
            return (
              <div key={z.name} className="flex items-center gap-3">
                <Icon className="text-muted-foreground h-4 w-4" />
                <span className="flex-1 text-sm">{z.name}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {z.pct}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-border flex items-center justify-between border-t pt-3 text-xs">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Expand className="h-3 w-3" /> View breakdown
          </button>
          <span className="text-muted-foreground">All {zones.length} zones</span>
        </div>
      </div>

      <PowerBreakdownModal
        open={open}
        onOpenChange={setOpen}
        totalKw={totalKw}
        zones={zones}
      />
    </>
  );
}

