"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Fuel,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PriceSpinner } from "./calculator/price-spinner";
import { useSavingsSetup } from "./savings-setup-context";
import {
  DEFAULT_FUEL_PRICE,
  GENERATOR_HOUR_PRESETS,
  type GeneratorHoursPreset,
  type GeneratorType,
  type SavingsSetupPreferences,
} from "@/types/savings-setup";

const SETUP_STEPS = [
  { id: 1, label: "Generator type" },
  { id: 2, label: "Daily runtime" },
  { id: 3, label: "Fuel price" },
] as const;

const GENERATOR_OPTIONS: {
  id: GeneratorType;
  label: string;
  description: string;
}[] = [
  {
    id: "petrol",
    label: "Petrol",
    description: "PMS / petrol generator",
  },
  {
    id: "diesel",
    label: "Diesel",
    description: "AGO / diesel generator",
  },
];

function ChoiceCard({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-xl border-2 bg-card p-4 text-left transition-all",
        selected
          ? "border-primary shadow-sm"
          : "border-border hover:border-muted-foreground/40",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            selected ? "bg-amber-light" : "bg-muted",
          )}
        >
          <Fuel
            className={cn(
              "h-4 w-4",
              selected ? "text-amber-60" : "text-muted-foreground",
            )}
          />
        </span>
        {selected ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </span>
        ) : (
          <span className="h-6 w-6 rounded-full border-2 border-border" />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

function StepProgressBars({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-5 flex gap-2">
      {SETUP_STEPS.map(({ id, label }) => {
        const isComplete = id < currentStep;
        const isActive = id === currentStep;

        return (
          <div key={id} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-border">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  isComplete || isActive ? "bg-primary" : "bg-transparent",
                )}
                initial={false}
                animate={{
                  width: isComplete ? "100%" : isActive ? "100%" : "0%",
                  opacity: isActive ? 0.55 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <span
              className={cn(
                "mt-1.5 block text-center text-[10px] sm:text-xs",
                isActive
                  ? "font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface SavingsSetupModalWizardProps {
  preferences: SavingsSetupPreferences | null;
  savePreferences: (prefs: SavingsSetupPreferences) => void;
  skipSetup: () => void;
}

function SavingsSetupModalWizard({
  preferences,
  savePreferences,
  skipSetup,
}: SavingsSetupModalWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [generatorType, setGeneratorType] = useState<GeneratorType | null>(
    () => preferences?.generatorType ?? null,
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

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const resolvedHours = (): number | undefined => {
    if (!hoursPreset) return undefined;
    if (hoursPreset === "custom") {
      const parsed = parseFloat(customHours);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    }
    return hoursPreset;
  };

  const handleSave = () => {
    if (!generatorType) return;
    if (!Number.isFinite(fuelPrice) || fuelPrice <= 0) return;

    const prefs: SavingsSetupPreferences = {
      generatorType,
      generatorHoursPerDay: resolvedHours(),
      generatorHoursPreset: hoursPreset ?? undefined,
      fuelPricePerLitre: fuelPrice,
      skipped: false,
      updatedAt: new Date().toISOString(),
    };
    savePreferences(prefs);
  };

  const fuelLabel =
    generatorType === "diesel" ? "Diesel (AGO) price" : "Petrol (PMS) price";

  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 28 : -28,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -28 : 28,
    }),
  };

  return (
    <>
        <div className="border-b border-border px-6 pt-6 pb-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold">
              Tell us about your generator
            </DialogTitle>
            <DialogDescription>
              We use this to calculate diesel vs petrol savings correctly. You
              can update these anytime in Profile Settings.
            </DialogDescription>
          </DialogHeader>

          <StepProgressBars currentStep={step} />
        </div>

        <div className="overflow-hidden px-6 py-5">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-4"
            >
              {step === 1 && (
                <>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      What type of generator do you use?
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose petrol or diesel — calculations differ on our
                      backend.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {GENERATOR_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt.id}
                        selected={generatorType === opt.id}
                        title={opt.label}
                        description={opt.description}
                        onSelect={() => setGeneratorType(opt.id)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Before solar, how many hours did your generator run per
                      day?
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Optional — helps estimate your pre-solar fuel spend.
                    </p>
                  </div>
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
                            : "border-border bg-card hover:bg-muted/50",
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
                          : "border-border bg-card hover:bg-muted/50",
                      )}
                    >
                      Custom
                    </button>
                  </div>
                  {hoursPreset === "custom" && (
                    <div className="max-w-[200px]">
                      <label className="text-xs font-medium text-muted-foreground">
                        Hours per day
                      </label>
                      <Input
                        type="number"
                        min={0.5}
                        max={24}
                        step={0.5}
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                        placeholder="e.g. 5"
                        className="mt-1"
                      />
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {fuelLabel}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Current pump price per litre in your area.
                    </p>
                  </div>
                  <PriceSpinner
                    value={fuelPrice}
                    onChange={setFuelPrice}
                    autoPrice={DEFAULT_FUEL_PRICE}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(step - 1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                type="button"
                disabled={step === 1 && !generatorType}
                onClick={() => goToStep(step + 1)}
                className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!generatorType || fuelPrice <= 0}
                onClick={handleSave}
                className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Save & continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => {
                  setHoursPreset(null);
                  setCustomHours("");
                  goToStep(3);
                }}
                className="font-medium text-muted-foreground hover:text-foreground"
              >
                Skip this step
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={skipSetup}
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        </div>
    </>
  );
}

interface SavingsSetupModalProps {
  onDismissSession?: () => void;
}

export function SavingsSetupModal({ onDismissSession }: SavingsSetupModalProps) {
  const { preferences, isModalOpen, closeSetup, savePreferences, skipSetup } =
    useSavingsSetup();

  const handleClose = () => {
    onDismissSession?.();
    closeSetup();
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl"
        showCloseButton
      >
        {isModalOpen ? (
          <SavingsSetupModalWizard
            key={preferences?.updatedAt ?? "empty"}
            preferences={preferences}
            savePreferences={savePreferences}
            skipSetup={skipSetup}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
