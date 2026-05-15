"use client";

import { Button } from "@/components/ui/button";
import { InverterCard } from "./inverter-card";
import { useInverterQueries } from "@/hooks/use-inverter-queries";

export type InverterType = string;

interface InverterTypeStepProps {
  selected: InverterType | null;
  onSelect: (type: InverterType) => void;
  onNext: () => void;
}

export function InverterTypeStep({
  selected,
  onSelect,
  onNext,
}: InverterTypeStepProps) {
  const { useSupportedBrands } = useInverterQueries();
  const { data: brandsResponse, isLoading, error } = useSupportedBrands();

  const brands = Array.isArray(brandsResponse) ? brandsResponse : [];

  const getSubTitle = (brandName: string) => {
    switch (brandName.toUpperCase()) {
      case "VICTRON":
        return "Vrm OAuth";
      default:
        return "API key";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
        Failed to load supported brands. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
        {brands.map((brandName) => (
          <InverterCard
            key={brandName}
            title={
              brandName.charAt(0).toUpperCase() +
              brandName.slice(1).toLowerCase()
            }
            subtitle={getSubTitle(brandName)}
            selected={selected === brandName}
            onSelect={() => onSelect(brandName)}
          />
        ))}
      </div>

      <div className="flex sm:justify-end">
        <Button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="h-14 w-full cursor-pointer rounded-lg bg-[#111827] text-base font-medium text-white hover:bg-[#111827]/90 disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-[#2A2F3C] disabled:opacity-100 sm:max-w-61.75 lg:text-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
