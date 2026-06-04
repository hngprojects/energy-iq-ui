"use client";
import { useState } from "react";
import { AlertCircle, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PriceSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  autoPrice: number;
}

export function PriceSpinner({
  value,
  onChange,
  autoPrice,
}: PriceSpinnerProps) {
  const [inputValue, setInputValue] = useState(String(value));
  const isModified = value !== autoPrice;

  const increment = () => {
    const next = Math.round((value + 1) * 100) / 100;
    onChange(next);
    setInputValue(String(next));
  };

  const decrement = () => {
    const next = Math.max(0, Math.round((value - 1) * 100) / 100);
    onChange(next);
    setInputValue(String(next));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^\d+(\.\d{0,2})?$/.test(raw) && raw !== "") return;
    setInputValue(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) onChange(Math.round(parsed * 100) / 100);
  };

  const resetToAuto = () => {
    onChange(autoPrice);
    setInputValue(String(autoPrice));
  };

  return (
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
          <Button
            type="button"
            variant="ghost"
            onClick={increment}
            aria-label="Increase price"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={decrement}
            aria-label="Decrease price"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isModified && (
        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Using custom price — auto price is ₦{autoPrice.toLocaleString()}
            /litre
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
  );
}
