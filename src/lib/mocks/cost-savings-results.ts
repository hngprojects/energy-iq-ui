export interface LegendItem {
  label: string;
  before: string;
  after: string;
}


export const FUEL_PRICE   = "₦897/L";
export const PETROL_RATE  = 2.5;
export const HOURS_BEFORE = 8;
export const HOURS_AFTER  = 2;
export const PAYBACK_PCT  = 48;


export const DAILY_LEGEND_ITEMS: LegendItem[] = [
  { label: "Total Active hours", before: "₦21,000", after: "₦14,500" },
  { label: "Equivalent power generated within active hours", before: "-", after: "₦2,740" },
  { label: "Equivalent PMS generator cost saved", before: "₦500", after: "₦1,500" },
];


export const WEEKLY_BAR_DATA = [
  { day: "Mon", savings: 14200, petrol: 21000 },
  { day: "Tue", savings: 15800, petrol: 21000 },
  { day: "Wed", savings: 13500, petrol: 21000 },
  { day: "Thu", savings: 16200, petrol: 21000 },
  { day: "Fri", savings: 15000, petrol: 21000 },
  { day: "Sat", savings: 17200, petrol: 21000 },
  { day: "Sun", savings: 14800, petrol: 21000 },
];


export const FUEL_SPARKLINE_DATA = [
  { v: 320000 }, { v: 340000 }, { v: 310000 },
  { v: 370000 }, { v: 360000 }, { v: 400000 },
  { v: 420000 }, { v: 410000 }, { v: 450000 },
];


export const SUMMARY_CARDS = [
  { label: "Total Cost Saved",  value: "₦8,200",  note: "vs petrol"         },
  { label: "Generator Cost Avoided", value: "₦240,000", note: "30-day projection" },
  { label: "Savings Percentage", value: "60%", note: "365-day estimate"  },
  { label: "CO2 avoided",    value: "216kg",    note: "per month"         },
] as const;
