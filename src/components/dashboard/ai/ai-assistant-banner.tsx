import { ArrowUpRight } from "lucide-react";

const suggestions = [
  "Why is my battery low?",
  "What used the most power today?",
  "Should I run the AC tonight?",
];

export function AIAssistantBanner() {
  return (
    <div className="bg-secondary text-secondary-foreground rounded-2xl p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Have a question about your energy?
          </h3>
          <p className="text-secondary-foreground/60 mt-1 text-sm">
            Ask EnergyIQ in English or Pidgin
          </p>
        </div>
        <button className="bg-background text-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-1 self-start rounded-lg px-4 py-2 text-sm font-medium transition-colors">
          Ask Energy AI <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-secondary-foreground/60 shrink-0 text-sm">
          Try this:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              className="border-secondary-foreground/20 bg-secondary-foreground/5 hover:bg-secondary-foreground/10 inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-colors"
            >
              {s} <ArrowUpRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
