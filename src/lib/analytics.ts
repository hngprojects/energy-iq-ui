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


export const identifyUser = (userId: string) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;
  mixpanel.identify(userId);
};

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (typeof window === "undefined" || !MIXPANEL_TOKEN) return;

  const sanitizedProperties = { ...properties };
  delete sanitizedProperties.email;
  delete sanitizedProperties.password;
  delete sanitizedProperties.name;

  mixpanel.track(eventName, {
    ...sanitizedProperties,
    timestamp: new Date().toISOString(),
  });
};
