"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Mic, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCard {
  title: string;
  description: string;
  promptText: string;
}

const SUGGESTIONS: SuggestionCard[] = [
  {
    title: "Why did my battery drain fast last night?",
    description:
      "Analyze overnight usage and identify what consumed the most power.",
    promptText: "Why did my battery drain fast last night?",
  },
  {
    title: "Is my inverter overloaded?",
    description: "Identify dangerous load spikes and system overload periods.",
    promptText: "Is my inverter overloaded?",
  },
  {
    title: "Are my solar panels underperforming?",
    description:
      "Detect weather impact, shading issues, or reduced solar output.",
    promptText: "Are my solar panels underperforming?",
  },
];

export default function NewChatPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleStartConversation = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Directing them straight to our dynamic route layout using a fresh id string
    const newChatId = `chat-${Date.now()}`;

    // You can pass the initial message text via search parameters or state managers if needed,
    // or let it act as an entryway to the workspace view.
    router.push(`/dashboard/ai-assistant/${newChatId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartConversation(input);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        {/* ── Center Logo / Icon Badge ─────────────────────────────────────── */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8"
          >
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* ── Headings ─────────────────────────────────────────────────────── */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ask EnergyIQ anything about <br /> your power system
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          EnergyIQ analyzes your inverter and energy data to explain battery
          drain, generator usage, savings, and solar performance in simple
          language.
        </p>

        {/* ── Input Box UI ─────────────────────────────────────────────────── */}
        <div className="mt-8 w-full rounded-xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <div className="flex items-end gap-3 px-3 py-2">
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="h-5 w-5" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your energy system"
              rows={1}
              className={cn(
                "flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder-muted-foreground outline-none",
                "max-h-32 min-h-[24px] leading-5",
              )}
              style={{ height: "auto" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleStartConversation(input)}
                disabled={!input.trim()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  input.trim()
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Suggested Section ────────────────────────────────────────────── */}
        <div className="mt-10 w-full text-left">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Suggested Questions</span>
            {showSuggestions ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showSuggestions && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SUGGESTIONS.map((card, i) => (
                <button
                  key={i}
                  onClick={() => handleStartConversation(card.promptText)}
                  className="flex flex-col text-left rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-muted-foreground/30 hover:bg-muted/20"
                >
                  <span className="text-sm font-semibold text-foreground line-clamp-2">
                    {card.title}
                  </span>
                  <span className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                    {card.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
