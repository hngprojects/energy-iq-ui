import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { TOTAL_STEPS } from "./calculator-context";

const STEP_LABELS = ["Select period", "PMS price", "Review input"];

export function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full my-6">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div
            key={stepNum}
            className="flex items-center flex-1 last:flex-none"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-medium border",
                  isDone && "bg-primary border-primary text-white",
                  isActive && "bg-foreground border-foreground text-background",
                  !isDone &&
                    !isActive &&
                    "opacity-50 border-border text-muted-foreground",
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-[11px] mt-1.5 text-center max-w-18",
                  "hidden sm:block",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>

            {stepNum < TOTAL_STEPS && (
              <div
                className={cn(
                  "flex-1 h-px mb-5",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
