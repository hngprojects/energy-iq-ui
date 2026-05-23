import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: false,
    persistence: "localStorage",
    api_transport: "sendBeacon",
  });
}

const PII_KEY_PATTERN =
  /^(email|password|phone|address|firstName|lastName|fullName|first_name|last_name|full_name)$/i;

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (PII_KEY_PATTERN.test(k)) continue;
      out[k] = sanitizeValue(v);
    }
    return out;
  }
  return value;
};

export const identifyUser = (userId: string) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;
  mixpanel.identify(userId);
};

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;

  const sanitizedProperties = sanitizeValue(properties ?? {}) as Record<string, unknown>;

  mixpanel.track(eventName, {
    ...sanitizedProperties,
    timestamp: new Date().toISOString(),
  });
};
