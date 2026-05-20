"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

    const newChatId = `chat-${Date.now()}`;

    router.push(`/dashboard/ai-assistant/${newChatId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartConversation(input);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] w-full flex-col items-center justify-start md:justify-center bg-background px-6 py-8 md:py-12 text-foreground overflow-y-auto">
      <div className="flex w-full max-w-7xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center">
          <Image
            src="/images/logo.svg"
            alt="EnergyIQ Logo"
            width={64}
            height={64}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ask EnergyIQ anything about <br /> your power system
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl">
          EnergyIQ analyzes your inverter and energy data to explain battery
          drain, generator usage, savings, and solar performance in simple
          language.
        </p>

        <div className="mt-8 w-full rounded-xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
          <div className="flex items-end gap-3 px-3 py-2">
            <button
              type="button"
              title="Add prompt"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:text-foreground"
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
                "max-h-32 min-h-6 leading-5",
              )}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                title="Record voice message"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:text-foreground"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Send message"
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
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {SUGGESTIONS.map((card, i) => (
                <button
                  key={i}
                  onClick={() => handleStartConversation(card.promptText)}
                  className="flex flex-col text-left rounded-xl border border-border cursor-pointer bg-card p-6 shadow-sm transition-all hover:border-muted-foreground/30 hover:bg-muted/20"
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
