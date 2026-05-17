
export type ChatTag = "Solar" | "Alert" | "Report";

export interface ChatItem {
  id: string;
  title: string;
  description: string;
  tag: ChatTag;
  timestamp: string;
  date: Date;
  messageCount: number;
  icon: "alert-triangle" | "battery-low" | "file-text" | "sun";
  pinned?: boolean;
  archived?: boolean;
}

export type MessageRole = "user" | "assistant";

export interface AlertCard {
  severity: "critical" | "warning" | "info";
  title: string;
  triggeredAt: string;
  status: string;
  detail: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  alertCard?: AlertCard;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  tag: ChatTag;
  icon: ChatItem["icon"];
}

export type FilterTab = "All" | "Solar" | "Alerts" | "Reports";

export interface GroupedChats {
  label: string;
  chats: ChatItem[];
}

export const MOCK_CHATS: ChatItem[] = [
  {
    id: "1",
    title: "Solar Output Drop – Unit 3",
    description: "Identified a 28% drop vs forecast. Likely inverter throttling",
    tag: "Solar",
    timestamp: "Today, 6:10am",
    date: new Date(),
    messageCount: 3,
    icon: "alert-triangle",
  },
  {
    id: "2",
    title: "Battery Critically Low – 3%",
    description: "Battery at 3% – recommend load shedding immediately",
    tag: "Alert",
    timestamp: "Today, 7:40am",
    date: new Date(),
    messageCount: 5,
    icon: "battery-low",
  },
  {
    id: "3",
    title: "Weekly Report – 28 Apr",
    description: "Report generated and sent to 3 recipients.",
    tag: "Report",
    timestamp: "Yesterday, 6:10am",
    date: new Date(Date.now() - 86400000),
    messageCount: 1,
    icon: "file-text",
  },
  {
    id: "4",
    title: "Battery Critically Low – 5%",
    description: "Battery at 5% – recommend load shedding immediately",
    tag: "Alert",
    timestamp: "2 May",
    date: new Date(Date.now() - 86400000 * 3),
    messageCount: 2,
    icon: "alert-triangle",
  },
  {
    id: "5",
    title: "Battery Critically Low – 3%",
    description: "Battery at 3% – recommend load shedding immediately",
    tag: "Alert",
    timestamp: "4 May",
    date: new Date(Date.now() - 86400000 * 5),
    messageCount: 2,
    icon: "battery-low",
  },
  {
    id: "6",
    title: "Solar Output Drop – Unit 3",
    description: "Identified a 28% drop vs forecast. Likely inverter throttling",
    tag: "Solar",
    timestamp: "2 May",
    date: new Date(Date.now() - 86400000 * 20),
    messageCount: 4,
    icon: "alert-triangle",
  },
  {
    id: "7",
    title: "Battery Critically Low – 3%",
    description: "Battery at 3% – recommend load shedding immediately",
    tag: "Alert",
    timestamp: "4 May",
    date: new Date(Date.now() - 86400000 * 22),
    messageCount: 2,
    icon: "battery-low",
  },
  {
    id: "8",
    title: "Battery Critically Low – 5%",
    description: "Battery at 5% – recommend load shedding immediately",
    tag: "Alert",
    timestamp: "2 May",
    date: new Date(Date.now() - 86400000 * 25),
    messageCount: 2,
    icon: "alert-triangle",
  },
];

export const MOCK_CONVERSATION: ChatConversation = {
  id: "2",
  title: "Battery critically low",
  createdAt: new Date(),
  tag: "Alert",
  icon: "battery-low",
  messages: [
    {
      id: "m1",
      role: "user",
      content: "What triggered the critical battery alert?",
      timestamp: "9:14am",
    },
    {
      id: "m2",
      role: "assistant",
      content: "I've pulled the alert details:",
      timestamp: "9:15am",
      alertCard: {
        severity: "critical",
        title: "Critical - Battery at 3%",
        triggeredAt: "Today 6:08AM",
        status: "Unresolved",
        detail: "Overnight grid draw: 47% above baseline. HVAC ran outside schedule.",
      },
    },
    {
      id: "m3",
      role: "assistant",
      content:
        "Battery level dropped to 3% at 6:08 AM. Overnight grid draw was 47% above baseline — analysis points to HVAC running outside its scheduled window (11 PM–5 AM).",
      timestamp: "9:15am",
    },
    {
      id: "m4",
      role: "user",
      content: "What steps should I take now?",
      timestamp: "9:19am",
    },
    {
      id: "m5",
      role: "assistant",
      content:
        "Recommended steps:\n1. Shed non-critical loads immediately (estimated recovery: +8%).\n2. Solar recharge should restore battery to ~45% by 9:30 AM if skies remain clear.",
      timestamp: "9:19am",
    },
  ],
};

export function groupChatsByDate(chats: ChatItem[]): GroupedChats[] {
  const now = new Date();

  // startOfDay helper — sets time to 00:00:00 using calendar date (DST-safe)
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const today = startOfDay(now);

  // Using setDate() is DST-safe because it works with calendar days not milliseconds
  const yesterday = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const weekAgo = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7));
  const monthAgo = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30));
  const monthLabel = monthAgo.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const groups: GroupedChats[] = [
    {
      label: "Today",
      chats: chats.filter((c) => c.date >= today),
    },
    {
      label: "Yesterday",
      chats: chats.filter((c) => c.date >= yesterday && c.date < today),
    },
    {
      label: "This Week",
      chats: chats.filter((c) => c.date >= weekAgo && c.date < yesterday),
    },
    {
      label: monthLabel,
      chats: chats.filter((c) => c.date >= monthAgo && c.date < weekAgo),
    },
    {
      label: "Older",                                    // ← catches everything older than 30 days
      chats: chats.filter((c) => c.date < monthAgo),
    },
  ];

  return groups.filter((g) => g.chats.length > 0);
}

export const SUGGESTED_QUESTIONS = [
  {
    id: "sq1",
    title: "Why did my battery drain fast last night?",
    description: "Analyze overnight usage and identify what consumed the most power.",
  },
  {
    id: "sq2",
    title: "Is my inverter overloaded?",
    description: "Identify dangerous load spikes and system overload periods.",
  },
  {
    id: "sq3",
    title: "Are my solar panels underperforming?",
    description: "Detect weather impact, shading issues, or reduced solar output.",
  },
];
