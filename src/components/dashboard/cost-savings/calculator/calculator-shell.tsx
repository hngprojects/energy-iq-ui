import { useEffect } from "react";
import { useCalculator } from "./calculator-context";
import { Step1Period } from "./steps/step-1-period";
import { Step2Price } from "./steps/step-2-price";
import { Step3Review } from "./steps/step-3-review";
import { StepProgressBar } from "./step-progress-bar";

interface CalculatorShellProps {
  onStepChange?: (step: number) => void;
}

export function CalculatorShell({ onStepChange }: CalculatorShellProps) {
  const { step } = useCalculator();

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  return (
    <div>
      <StepProgressBar currentStep={step} />

      {step === 1 && <Step1Period />}
      {step === 2 && <Step2Price />}
      {step === 3 && <Step3Review />}
    </div>
  );
}
