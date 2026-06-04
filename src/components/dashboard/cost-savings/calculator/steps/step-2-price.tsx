"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AboutThisPrice } from "../../cards/about-this-price";
import { PriceSpinner } from "../price-spinner";

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

        {/* Price + info card row */}
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

          {/* Divider */}
          <div className="hidden sm:block w-px bg-border self-stretch" />
          <div className="sm:hidden h-px bg-border" />

          {/* Right — about this price */}
          <AboutThisPrice />
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
          <PriceSpinner
            value={price}
            onChange={setPrice}
            autoPrice={AUTO_PRICE}
          />

          {/* Tip banner */}
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
