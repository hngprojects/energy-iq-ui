"use client";

import { Info, Check } from "lucide-react";

const BULLET_POINTS = [
  "This is the average pump price of PMS (Petrol) in Lagos",
  "Prices may vary slightly depending on your exact location.",
  "You can update this price manually if needed",
];

export function AboutThisPrice() {
  return (
    <div className="rounded-xl bg-card p-4 flex flex-col gap-3 sm:w-[260px] sm:flex-none sm:ml-auto">
      <div className="flex items-start gap-2">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-light shrink-0">
          <Info className="h-2.5 w-2.5 text-amber-60" />
        </span>
        <p className="text-sm font-semibold text-foreground">
          About this price
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {BULLET_POINTS.map((note) => (
          <li key={note} className="flex items-start gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-primary mt-0.5 shrink-0">
              <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
            </span>
            <span className="text-xs text-muted-foreground">{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
