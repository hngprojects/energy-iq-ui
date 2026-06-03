import { createContext, useContext } from "react";

export const CalculatorContext = createContext({});
export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalculatorContext.Provider value={{}}>
      {children}
    </CalculatorContext.Provider>
  );
}
export function useCalculator() {
  return useContext(CalculatorContext);
}
