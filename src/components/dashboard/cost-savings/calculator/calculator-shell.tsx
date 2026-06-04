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
  const { step, setData, goNext, goBack } = useCalculator();

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  return (
    <div>
      <StepProgressBar currentStep={step} />

      {step === 1 && (
        <Step1Period
          onContinue={(data) => {
            setData({
              period: data.period,
              customStartDate: data.customStartDate,
              customEndDate: data.customEndDate,
            });
            goNext();
          }}
        />
      )}
      {step === 2 && (
        <Step2Price
          onBack={() => goBack()}
          onContinue={(data) => {
            setData({ pmsPricePerLitre: data.pmsPrice });
            goNext();
          }}
        />
      )}
      {step === 3 && <Step3Review />}
    </div>
  );
}
