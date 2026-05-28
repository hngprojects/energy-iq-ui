"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    const shouldRegister = process.env.NODE_ENV === "production";

    if (shouldRegister && "serviceWorker" in navigator) {
      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .catch((err) => console.error("SW registration failed:", err));
      };

      window.addEventListener("load", registerServiceWorker);

      return () => {
        window.removeEventListener("load", registerServiceWorker);
      };
    }
  }, []);

  return null;
}
