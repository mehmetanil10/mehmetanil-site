"use client";

import { useEffect, useState } from "react";

export function useAdminAvailability() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;

      try {
        const response = await fetch("/api/admin/presence", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { online?: boolean };
        setOnline(data.online === true);
      } catch {
        setOnline(false);
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return online;
}
