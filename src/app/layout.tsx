import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "./providers/query-provider";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Energy IQ";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),

  title: {
    default: appName,
    template: `%s · ${appName}`,
  },

  description:
    "Energy IQ is a smart energy monitoring platform for tracking usage, optimizing power consumption, and improving energy efficiency.",

  keywords: [
    "Energy monitoring",
    "Smart energy",
    "Power usage analytics",
    "Energy savings",
    "Solar monitoring",
    "Energy IQ",
  ],

  authors: [{ name: "Energy IQ Team" }],

  openGraph: {
    title: appName,
    description:
      "Track, analyze, and optimize your energy consumption with Energy IQ.",
    url: appUrl,
    siteName: appName,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: appName,
    description:
      "Track, analyze, and optimize your energy consumption with Energy IQ.",
  },

  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        figtree.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

