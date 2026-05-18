export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Faq", href: "/#faq" },
  { label: "About Us", href: "/about" },
] as const;

export const VALID_PATHS = new Set<string>([
  "/",
  ...NAV_LINKS.map((link) => link.href),
]);
