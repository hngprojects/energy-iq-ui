"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Calendar, ChevronDown, Settings2 } from "lucide-react";
import { useSavingsSetup } from "@/components/dashboard/cost-savings/savings-setup-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export type CostSavingsTab =
  | "summary"
  | "calculator"
  | "results"
  | "cumulative-tracker";

interface TabConfig {
  id: CostSavingsTab;
  label: string;
}

const TABS: TabConfig[] = [
  { id: "summary", label: "Summary" },
  { id: "calculator", label: "Calculator" },
  { id: "results", label: "Results" },
  { id: "cumulative-tracker", label: "Cumulative tracker" },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const TAB_HEADER: Record<
  Exclude<CostSavingsTab, "summary">,
  { title: string; subtitle: string }
> = {
  calculator: {
    title: "Calculator Savings",
    subtitle: "",
  },
  results: {
    title: "Savings Results",
    subtitle: "Review your calculated savings",
  },
  "cumulative-tracker": {
    title: "Cumulative Tracker",
    subtitle: "Real-time tracker of your solar investment impact.",
  },
};

export type SummaryPeriod = "daily" | "weekly" | "monthly";

type CostSavingsTabsProps = (
  | {
      useSearchParamNav: true;
      activeTab?: never;
      onTabChange?: never;
    }
  | {
      useSearchParamNav?: false;
      activeTab?: CostSavingsTab;
      onTabChange?: (tab: CostSavingsTab) => void;
    }
) & {
  className?: string;
  calculatorStep?: number;
  totalCalculatorSteps?: number;
  summaryPeriod?: SummaryPeriod;
  onSummaryPeriodChange?: (period: SummaryPeriod) => void;
};

function CostSavingsTabsInner({
  activeTab,
  onTabChange: handleTabChange,
  className,
  calculatorStep = 1,
  totalCalculatorSteps = 3,
  summaryPeriod = "daily",
  onSummaryPeriodChange,
}: {
  activeTab: CostSavingsTab;
  onTabChange: (tab: CostSavingsTab) => void;
  className?: string;
  calculatorStep?: number;
  totalCalculatorSteps?: number;
  summaryPeriod?: SummaryPeriod;
  onSummaryPeriodChange?: (period: SummaryPeriod) => void;
}) {
  const { user } = useAuthStore();
  const { isSetupComplete, openSetup } = useSavingsSetup();

  const [localPeriod, setLocalPeriod] = useState<SummaryPeriod>("daily");
  const effectivePeriod = onSummaryPeriodChange ? summaryPeriod : localPeriod;
  const handlePeriodChange = (period: SummaryPeriod) => {
    if (onSummaryPeriodChange) {
      onSummaryPeriodChange(period);
    } else {
      setLocalPeriod(period);
    }
  };

  const { title, subtitle } =
    activeTab === "summary"
      ? {
          title: `${getGreeting()}, ${user?.firstName ?? "User"}!`,
          subtitle: "Here's your energy summary today",
        }
      : activeTab === "calculator"
        ? {
            title: TAB_HEADER.calculator.title,
            subtitle: `Step ${calculatorStep} of ${totalCalculatorSteps}`,
          }
        : TAB_HEADER[activeTab];

  return (
    <div className={cn("w-full", className)}>
      {/* Page-level header */}
      <div className="flex mb-6 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
            {title}
          </h1>
          <p
            className={cn(
              "mt-1 text-sm",
              activeTab === "calculator"
                ? "text-primary font-medium"
                : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isSetupComplete ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openSetup}
              className="gap-2 border-primary/40 text-primary hover:bg-primary/5"
            >
              <Settings2 className="h-4 w-4" />
              Savings setup
            </Button>
          ) : null}
          {activeTab === "summary" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="border-border hover:bg-accent inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{effectivePeriod}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePeriodChange("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : null}
        </div>
      </div>

      {/* Tab strip */}
      <div className="mt-3 border-b border-border">
        <nav
          className="-mb-px flex gap-4 sm:gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
          aria-label="Cost and Savings tabs"
        >
          {TABS.map(({ id, label }) => {
            const isActive = id === activeTab;
            return (
              <Button
                key={id}
                type="button"
                variant="ghost"
                onClick={() => handleTabChange(id)}
                className={cn(
                  "rounded-none whitespace-nowrap pb-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive
                    ? "border-0 border-b-2 border-primary text-foreground"
                    : "border-0 border-b-2 border-transparent text-muted-foreground hover:text-foreground/80",
                )}
              >
                {label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function CostSavingsTabsUrlSynced(
  props: Omit<
    CostSavingsTabsProps & { useSearchParamNav: true },
    "useSearchParamNav" | "activeTab" | "onTabChange"
  >,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const VALID_TABS: CostSavingsTab[] = [
    "summary",
    "calculator",
    "results",
    "cumulative-tracker",
  ];
  const rawTab = searchParams.get("tab") as CostSavingsTab;
  const paramTab = VALID_TABS.includes(rawTab) ? rawTab : "summary";

  const handleTabChange = useCallback(
    (tab: CostSavingsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  return (
    <CostSavingsTabsInner
      {...props}
      activeTab={paramTab}
      onTabChange={handleTabChange}
    />
  );
}

function CostSavingsTabsControlled({
  activeTab: controlledTab,
  onTabChange,
  ...props
}: Omit<
  CostSavingsTabsProps & { useSearchParamNav?: false },
  "useSearchParamNav"
>) {
  const [localTab, setLocalTab] = useState<CostSavingsTab>("summary");
  const activeTab = controlledTab ?? localTab;

  const handleTabChange = useCallback(
    (tab: CostSavingsTab) => {
      if (onTabChange) {
        onTabChange(tab);
      } else {
        setLocalTab(tab);
      }
    },
    [onTabChange],
  );

  return (
    <CostSavingsTabsInner
      {...props}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}

export function CostSavingsTabs({
  useSearchParamNav,
  ...rest
}: CostSavingsTabsProps) {
  if (useSearchParamNav) {
    return <CostSavingsTabsUrlSynced {...rest} />;
  }
  return (
    <CostSavingsTabsControlled
      {...(rest as Parameters<typeof CostSavingsTabsControlled>[0])}
    />
  );
}

export function useActiveCostSavingsTab(): CostSavingsTab {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") as CostSavingsTab;
  const VALID_TABS: CostSavingsTab[] = [
    "summary",
    "calculator",
    "results",
    "cumulative-tracker",
  ];
  return VALID_TABS.includes(rawTab) ? rawTab : "summary";
}
