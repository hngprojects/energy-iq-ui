import { createContext, useContext, useState, useCallback } from "react";

export const TOTAL_STEPS = 3;

export type CalculationPeriod =
  | "this-week"
  | "this-month"
  | "last-month"
  | "custom";

export interface CalculatorData {
  // Step 1 - Select Period
  period?: CalculationPeriod;
  customStartDate?: string;
  customEndDate?: string;

  // Step 2 - PMS (Diesel) Price
  pmsPricePerLitre?: number; // in Naira, auto-fetched or manual
}

interface CalculatorContextValue {
  step: number;
  data: CalculatorData;
  setData: (partial: Partial<CalculatorData>) => void;
  goNext: () => void;
  goBack: () => void;
  goToStep: (step: number) => void;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const [data, setDataState] = useState<CalculatorData>({});

  const setData = useCallback(
    (partial: Partial<CalculatorData>) =>
      setDataState((prev) => ({ ...prev, ...partial })),
    [],
  );

  const goNext = useCallback(
    () => setStep((s) => Math.min(s + 1, TOTAL_STEPS)),
    [],
  );
  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);
  const goToStep = useCallback(
    (target: number) =>
      setStep(Math.min(Math.max(target, 1), TOTAL_STEPS)),
    [],
  );

  return (
    <CalculatorContext.Provider
      value={{ step, data, setData, goNext, goBack, goToStep }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx)
    throw new Error("useCalculator must be used inside CalculatorProvider");
  return ctx;
}
