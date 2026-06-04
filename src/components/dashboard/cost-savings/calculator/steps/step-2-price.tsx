"use client";

import { useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  Info,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step2PmsPriceProps {
  onBack?: () => void;
  onContinue?: (data: { pmsPrice: number }) => void;
}

const AUTO_PRICE = 870;

const lastUpdated = `Today, ${new Date().toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}`;

export function Step2Price({ onBack, onContinue }: Step2PmsPriceProps) {
  const [price, setPrice] = useState(AUTO_PRICE);
  const [inputValue, setInputValue] = useState(String(AUTO_PRICE));

  const increment = () => {
    const next = Math.round((price + 1) * 100) / 100;
    setPrice(next);
    setInputValue(String(next));
  };

  const decrement = () => {
    const next = Math.max(0, Math.round((price - 1) * 100) / 100);
    setPrice(next);
    setInputValue(String(next));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^\d+(\.\d{0,2})?$/.test(raw) && raw !== "") return;
    setInputValue(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) setPrice(Math.round(parsed * 100) / 100);
  };

  const resetToAuto = () => {
    setPrice(AUTO_PRICE);
    setInputValue(String(AUTO_PRICE));
  };
  const isModified = price !== AUTO_PRICE;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-6">
        {/* Section heading */}
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Real-time PMS (Diesel) Price
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We fetch the latest petrol (PMS) price in your area to calculate
            your generator cost.
          </p>
        </div>

        {/* Price + info card row — no border on outer amber card */}
        <div className="rounded-2xl bg-amber-bg-light p-6 flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Left — current price */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">
              Current PMS Price
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-60">
                ₦{AUTO_PRICE.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-foreground">/ litre</span>
            </div>

            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-battery-full">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Auto-updated
            </span>

            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Right — small card at the end */}
          <div className="rounded-xl bg-card p-4 flex flex-col gap-3 sm:w-[260px] sm:flex-none sm:ml-auto">
            <div className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-light shrink-0">
                <Info className="h-4 w-4 text-amber-60" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                About this price
              </p>
            </div>
            <ul className="flex flex-col gap-2">
              {[
                "This is the average pump price of PMS (Petrol) in Lagos",
                "Prices may vary slightly depending on your exact location.",
                "You can update this price manually if needed",
              ].map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-primary mt-0.5 shrink-0">
                    <Check
                      className="h-2.5 w-2.5 text-primary"
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Adjust price section */}
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Adjust Price{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (Optional)
            </span>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            You can adjust the price if your current local price is different
          </p>
        </div>

        {/* Spinner input + tip row */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Spinner — ~55% */}
          <div className="w-full sm:w-[55%]">
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border bg-background px-4 py-3 transition-colors",
                isModified ? "border-primary" : "border-border",
              )}
            >
              <div className="flex flex-col gap-0.5 flex-1">
                <label
                  htmlFor="pms-price-input"
                  className="text-xs text-muted-foreground"
                >
                  PMS Price (₦/litre)
                </label>
                <input
                  id="pms-price-input"
                  type="text"
                  inputMode="numeric"
                  title="PMS price per litre"
                  placeholder="Enter price"
                  value={inputValue}
                  onChange={handleInput}
                  className="bg-transparent text-lg font-semibold text-foreground focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-0.5 ml-3">
                <button
                  type="button"
                  onClick={increment}
                  aria-label="Increase price"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={decrement}
                  aria-label="Decrease price"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isModified && (
              <div className="mt-2 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Using custom price — auto price is ₦
                  {AUTO_PRICE.toLocaleString()}/litre
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetToAuto}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset
                </Button>
              </div>
            )}
          </div>
          {/* Tip banner — ~45%, no border */}
          <div className="w-full sm:w-[45%] flex items-start gap-3 rounded-xl bg-amber-bg-light px-4 py-3">
            <Lightbulb className="h-8 w-8 text-primary shrink-0 mt-2" />
            <div>
              <p className="text-lg mt-0.5 font-semibold text-foreground">
                Tip
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use the auto-updated price for the most accurate calculation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="gap-2 px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={() => onContinue?.({ pmsPrice: price })}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 px-8"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
