"use client";

import { useEffect } from "react";

export function AdminPresenceHeartbeat() {
  useEffect(() => {
    const ping = () => {
      if (document.visibilityState !== "visible") return;

      void fetch("/api/admin/presence", {
        method: "POST",
        cache: "no-store",
        keepalive: true,
      }).catch(() => {
        // Durum sinyali admin panelinin kullanımını etkilememeli.
      });
    };

    ping();
    const interval = window.setInterval(ping, 30_000);
    document.addEventListener("visibilitychange", ping);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", ping);
    };
  }, []);

  return null;
}
