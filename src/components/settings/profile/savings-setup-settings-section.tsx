"use client";

import { useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PriceSpinner } from "@/components/dashboard/cost-savings/calculator/price-spinner";
import { useSavingsSetup } from "@/components/dashboard/cost-savings/savings-setup-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DEFAULT_FUEL_PRICE,
  GENERATOR_HOUR_PRESETS,
  type GeneratorHoursPreset,
  type GeneratorType,
  type SavingsSetupPreferences,
} from "@/types/savings-setup";

function SavingsSetupSettingsForm({
  preferences,
  savePreferences,
  isSaving,
}: {
  preferences: SavingsSetupPreferences | null;
  savePreferences: (prefs: SavingsSetupPreferences) => Promise<void>;
  isSaving: boolean;
}) {
  const [generatorType, setGeneratorType] = useState<GeneratorType | "">(
    () => preferences?.generatorType ?? "",
  );
  const [hoursPreset, setHoursPreset] = useState<GeneratorHoursPreset | null>(
    () => preferences?.generatorHoursPreset ?? null,
  );
  const [customHours, setCustomHours] = useState(() =>
    preferences?.generatorHoursPreset === "custom" &&
    preferences.generatorHoursPerDay != null
      ? String(preferences.generatorHoursPerDay)
      : "",
  );
  const [fuelPrice, setFuelPrice] = useState(
    () => preferences?.fuelPricePerLitre ?? DEFAULT_FUEL_PRICE,
  );
  const [saving, setSaving] = useState(false);

  const resolvedHours = (): number | undefined => {
    if (!hoursPreset) return undefined;
    if (hoursPreset === "custom") {
      const parsed = parseFloat(customHours);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    }
    return hoursPreset;
  };

  const handleSave = async () => {
    if (!generatorType) {
      toast.error("Please select a generator type.");
      return;
    }
    if (fuelPrice <= 0) {
      toast.error("Please enter a valid fuel price.");
      return;
    }

    setSaving(true);
    try {
      const prefs: SavingsSetupPreferences = {
        generatorType,
        generatorHoursPerDay: resolvedHours(),
        generatorHoursPreset: hoursPreset ?? undefined,
        fuelPricePerLitre: fuelPrice,
        skipped: false,
        updatedAt: new Date().toISOString(),
      };
      await savePreferences(prefs);
      toast.success("Savings preferences saved.");
    } catch {
      toast.error("Failed to save savings preferences.");
    } finally {
      setSaving(false);
    }
  };

  const fuelLabel =
    generatorType === "diesel" ? "Diesel (AGO) price" : "Petrol (PMS) price";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-dark-text">
          Generator type
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:max-w-md">
          {(["petrol", "diesel"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setGeneratorType(type)}
              className={cn(
                "flex-1 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-colors",
                generatorType === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-dark-text">
          Daily generator runtime{" "}
          <span className="font-normal text-[#5D5C5D]">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GENERATOR_HOUR_PRESETS.map((hrs) => (
            <button
              key={hrs}
              type="button"
              onClick={() => {
                setHoursPreset(hrs);
                setCustomHours("");
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                hoursPreset === hrs
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {hrs} hrs
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHoursPreset("custom")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              hoursPreset === "custom"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-muted/50",
            )}
          >
            Custom
          </button>
        </div>
        {hoursPreset === "custom" && (
          <div className="max-w-[200px]">
            <Input
              type="number"
              min={0.5}
              max={24}
              step={0.5}
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              placeholder="Hours per day"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-dark-text">{fuelLabel}</label>
        <div className="max-w-md">
          <PriceSpinner
            value={fuelPrice}
            onChange={setFuelPrice}
            autoPrice={DEFAULT_FUEL_PRICE}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
        <Button
          type="button"
          disabled={saving || isSaving || !generatorType}
          onClick={handleSave}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto hover:text-white"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save Savings Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}

export function SavingsSetupSettingsSection() {
  const { preferences, savePreferences, isSaving } = useSavingsSetup();

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-dark-text">
          Savings Calculator Setup
        </h2>
        <p className="mt-0.5 text-sm text-[#5D5C5D]">
          Generator and fuel details used for cost &amp; savings calculations.
          Update these anytime.
        </p>
      </div>

      <SavingsSetupSettingsForm
        key={preferences?.updatedAt ?? "empty"}
        preferences={preferences}
        savePreferences={savePreferences}
        isSaving={isSaving}
      />
    </div>
  );
}
