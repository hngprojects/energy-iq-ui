import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Initialize mixpanel on the client side only
if (typeof window !== "undefined" && MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: false, // We'll handle this manually
    persistence: "localStorage",
  });
}

/**
 * Identify a user in mixpanel
 */
export const identifyUser = (userId: string) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;
  mixpanel.identify(userId);
};

/**
 * Track an event with properties
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;

  // Ensure no PII is accidentally passed through from UI forms
  const sanitizedProperties = { ...properties };
  delete sanitizedProperties.email;
  delete sanitizedProperties.password;
  delete sanitizedProperties.name;

  mixpanel.track(eventName, {
    ...sanitizedProperties,
    timestamp: new Date().toISOString(),
  });
};
