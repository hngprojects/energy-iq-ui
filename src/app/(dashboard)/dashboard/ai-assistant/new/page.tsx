"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronUp, Mic, Plus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
          <div className="flex items-center gap-3 px-3 py-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Add prompt"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground hover:text-foreground hover:bg-transparent"
            >
              <Plus className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center min-h-9">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your energy system"
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none py-1 h-auto",
                  "max-h-32 min-h-0 leading-5 border-0 p-0 shadow-none focus-visible:ring-0",
                )}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;

                  const parent = el.parentElement;
                  if (parent) {
                    if (el.scrollHeight > 40) {
                      parent.parentElement?.classList.remove("items-center");
                      parent.parentElement?.classList.add("items-end");
                    } else {
                      parent.parentElement?.classList.remove("items-end");
                      parent.parentElement?.classList.add("items-center");
                    }
                  }
                }}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 self-end mb-0.5 md:self-auto md:mb-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Record voice message"
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:text-foreground hover:bg-transparent"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                title="Send message"
                onClick={() => handleStartConversation(input)}
                disabled={!input.trim()}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors border-0 p-0 shadow-none",
                  input.trim()
                    ? "bg-foreground text-background hover:opacity-90 hover:bg-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted",
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full text-left">
          <Button
            variant="ghost"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-transparent p-0 h-auto"
          >
            <span>Suggested Questions</span>
            {showSuggestions ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>

          {showSuggestions && (
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {SUGGESTIONS.map((card, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => handleStartConversation(card.promptText)}
                  className="flex flex-col items-start h-auto text-left rounded-xl border border-border cursor-pointer bg-card p-6 shadow-sm transition-all hover:border-muted-foreground/30 hover:bg-muted/20 whitespace-normal"
                >
                  <span className="text-sm font-semibold text-foreground line-clamp-2">
                    {card.title}
                  </span>
                  <span className="mt-1.5 text-xs text-muted-foreground line-clamp-2 font-normal">
                    {card.description}
                  </span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
