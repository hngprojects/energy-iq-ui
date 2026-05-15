"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, ChevronUp } from "lucide-react";
import Image from "next/image";
import { ChatInput } from "./ChatInput";
import { SUGGESTED_QUESTIONS } from "../lib/mockData";
import { cn } from "@/lib/utils";

export function StartChat() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  const handleSend = async (message: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    router.push("/assistant/2");
  };

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Mobile page header ─────────────────── */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 leading-tight">
            New Conversation
          </h1>
          <p className="text-xs text-gray-400 leading-tight">
            Your Energy Intelligence Assistant
          </p>
        </div>
      </div>

      {/* ── Main scrollable content ──────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col h-full items-center justify-center px-6 py-8">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 lg:p-5 lg:gap-8 lg:w-[688px] lg:h-[288px] ">

          <div className="w-[64px] h-64px">
            <Image
              src="/images/logo.svg"
              alt="EnergyIQ Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>


          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 max-w-sm leading-tight mb-3">
            Ask EnergyIQ anything about your power system
          </h1>
          <p className="text-sm text-gray-500 max-w-sm lg:max-w-md leading-relaxed">
            EnergyIQ analyzes your inverter and energy data to explain battery
            drain, generator usage, savings, and solar performance in simple
            language.
          </p>
        </div>
        <div className="w-full  mb-8">
          <ChatInput
            onSend={handleSend}
            disabled={loading}
            placeholder="Ask anything about your energy system"
          />
        </div>

        {/* Suggested questions */}
        <div className="w-full ">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">
              Suggested Questions
            </span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.title)}
                className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-semibold text-gray-900 mb-1.5 group-hover:text-amber-700 transition-colors leading-snug">
                  {q.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {q.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
