import { CalculatorShell } from "./calculator-shell";

interface CalculatorPanelProps {
  onStepChange?: (step: number) => void;
}

export function CalculatorPanel({ onStepChange }: CalculatorPanelProps) {
  return <CalculatorShell onStepChange={onStepChange} />;
}
