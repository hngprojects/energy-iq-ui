export interface Message {
  id: string;

  role: "user" | "ai";

  content: string;

  timestamp: string;

  userInitials?: string;

  alertCard?: {
    severity: "critical" | "warning" | "info";

    title: string;

    triggeredAt: string;

    status: string;

    details: string;
  };
}

export interface ChatSession {
  id: string;

  title: string;

  dateLabel: string;

  iconType: "battery" | "solar" | "grid";

  messages: Message[];
}

export const MOCK_AI_CHATS: Record<string, ChatSession> = {
  "battery-critical-101": {
    id: "battery-critical-101",

    title: "Battery critically low",

    dateLabel: "Today, 6:10 am",

    iconType: "battery",

    messages: [
      {
        id: "1",

        role: "user",

        content: "What triggered the critical battery alert?",

        timestamp: "9:14am",

        userInitials: "AA",
      },

      {
        id: "2",

        role: "ai",

        content: "I've pulled the alert details:",

        timestamp: "9:15am",

        alertCard: {
          severity: "critical",

          title: "Battery at 3%",

          triggeredAt: "Today 6:08AM",

          status: "Unresolved",

          details:
            "Overnight grid draw: 47% above baseline. HVAC ran outside schedule.",
        },
      },

      {
        id: "3",

        role: "ai",

        content:
          "Battery level dropped to 3% at 6:08 AM. Overnight grid draw was 47% above baseline — analysis points to HVAC running outside its scheduled window (11 PM–5 AM).",

        timestamp: "9:15am",
      },

      {
        id: "4",

        role: "user",

        content: "What steps should I take now?",

        timestamp: "9:19am",

        userInitials: "AA",
      },

      {
        id: "5",

        role: "ai",

        content:
          "Recommended steps:\n1. Shed non-critical loads immediately (estimated recovery: +8%).\n2. Solar recharge should restore battery to ~45% by 9:30 AM if skies remain clear.",

        timestamp: "9:19am",
      },
    ],
  },

  "solar-optimization-202": {
    id: "solar-optimization-202",

    title: "Solar array clipping warning",

    dateLabel: "Yesterday, 2:15 pm",

    iconType: "solar",

    messages: [
      {
        id: "s1",

        role: "user",

        content: "Why did my clean energy yield drop around noon?",

        timestamp: "2:15pm",

        userInitials: "AA",
      },

      {
        id: "s2",

        role: "ai",

        content:
          "Inverter 2 hit its thermal clipping ceiling due to the 98°F ambient peak heat. Output was throttled by 12% to protect the hardware. It stabilized once clouds provided some structural cooling at 1:15 PM.",

        timestamp: "2:16pm",
      },
    ],
  },
};

export async function getMockAIResponse(
  userPrompt: string,
): Promise<Partial<Message>> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const cleanPrompt = userPrompt.toLowerCase();

  if (cleanPrompt.includes("hvac") || cleanPrompt.includes("shed")) {
    return {
      content:
        "I can safely initialize a smart load-shed routine to isolate zone 2 HVAC. Shall I proceed with dropping non-essential systems?",
    };
  }

  if (cleanPrompt.includes("solar") || cleanPrompt.includes("weather")) {
    return {
      content:
        "The local meteorological feed expects sustained sunshine for the next 4 hours. No additional grid-balancing transactions are required.",
    };
  }

  // Fallback default message

  return {
    content:
      "Understood. I am parsing your system analytics metrics to confirm the configuration pattern. Let me know if you want me to spin up a diagnostics sweep.",
  };
}
