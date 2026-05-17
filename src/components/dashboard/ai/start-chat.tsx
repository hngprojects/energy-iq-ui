"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, } from "lucide-react";
import Image from "next/image";
import { ChatInput } from "./chat-input";
import { SUGGESTED_QUESTIONS } from "@/lib/mocks/ai-data";


export function StartChat() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSend = async (message: string) => {

    if (!message.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    // Pass message as a query param so the chat page knows what was asked
    // router.push(`/dashboard/ai-assistant/2?q=${encodeURIComponent(message)}`);
    router.push("/dashboard/ai-assistant/2");
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
      <div className="flex-1 overflow-y-auto flex flex-col font-dm-sans h-full w-full rounded-[8px] items-center justify-center p-5 bg-[#FBFBFB]">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center lg:p-5 lg:gap-8 lg:w-[688px] lg:h-[288px] ">

          <div className="w-[64px] h-[64px] ">
            <Image
              src="/images/logo.svg"
              alt="EnergyIQ Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <div className="h-[152px] flex flex-col justify-between items-center">
          <h1 className="text-2xl lg:text-[36px] font-semibold text-[#121212] lg:w-[557px]  ">
            Ask EnergyIQ anything about your power system
          </h1>
          <p className="text-base text-[#2A2F3C] ">
            EnergyIQ analyzes your inverter and energy data to explain battery
            drain, generator usage, savings, and solar performance in simple
            language.
          </p>
          </div>
        </div>

        <div className="w-full 2xl:w-[1151px] mt-10 gap-[32px]">
          <div className="w-full mb-8 rounded-[8px] ">
            <ChatInput
              onSend={handleSend}
              disabled={loading}
              placeholder="Ask anything about your energy system"
             
            />
          </div>

          {/* Suggested questions */}
          <div className="w-full 2xl:w-[1151px] flex flex-col gap-[20px]">
            <div className="flex items-center gap-[4px]">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[24px]">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSend(q.title)}
                  className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all group"
                >
                  <p className="text-base font-semibold text-[#121212] mb-1.5 group-hover:text-amber-700 transition-colors leading-snug">
                    {q.title}
                  </p>
                  <p className="text-[14px] text-[#5D5C5D] leading-relaxed">
                    {q.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
