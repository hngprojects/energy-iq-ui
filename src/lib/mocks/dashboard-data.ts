export const dashboardMock = {
  user: { name: "Amaka", avatar: "" },
  status: { label: "All systems is working fine", updated: "2 min ago" },
  alert:
    "Your battery will run flat by 10am. Switch off the AC in the back room now.",
  solar: {
    value: 4.2,
    unit: "kW",
    peak: "5.8 kW at 12:30 pm",
    note: "Panel working well",
  },
  battery: { percent: 74, hoursLeft: 6 },
  running: { value: 2.8, unit: "kW", capacityPct: 67, note: "Steady load" },
  savedToday: { amount: 8430, diesel: 15200, deltaPct: 12 },
  savedMonth: {
    amount: 41200,
    deltaPct: -20,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    active: "May",
  },
  zones: [
    { name: "Cold room", pct: 44, watts: 1240 },
    { name: "Back room AC", pct: 29, watts: 820 },
    { name: "Lighting", pct: 15, watts: 410 },
    { name: "Heater", pct: 6, watts: 180 },
  ],
  weekly: [
    { day: "Mon", generated: 22, used: 19 },
    { day: "Tue", generated: 24, used: 20 },
    { day: "Wed", generated: 23, used: 21 },
    { day: "Thurs", generated: 31, used: 25 },
    { day: "Fri", generated: 30, used: 24 },
    { day: "Sat", generated: 27, used: 22 },
    { day: "Sun", generated: 24, used: 20 },
  ],
};

export type DashboardData = typeof dashboardMock;
