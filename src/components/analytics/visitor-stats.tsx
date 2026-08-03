"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Users } from "lucide-react";
import { getVisitorId } from "@/lib/visitor-id";

type Stats = { today: number; online: number };

type VisitorStatsProps = {
  track?: boolean;
  variant?: "footer" | "cards";
};

export function VisitorStats({ track = false, variant = "footer" }: VisitorStatsProps) {
  const [stats, setStats] = useState<Stats>({ today: 0, online: 0 });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/analytics", {
        method: track ? "POST" : "GET",
        headers: track ? { "Content-Type": "application/json" } : undefined,
        body: track ? JSON.stringify({ visitorId: getVisitorId() }) : undefined,
        cache: "no-store",
        keepalive: track,
      });

      if (!response.ok) return;
      setStats((await response.json()) as Stats);
    } catch {
      // Sayaçlar sayfanın asıl içeriğini etkilememeli.
    }
  }, [track]);

  useEffect(() => {
    void refresh();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 30_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  if (variant === "cards") {
    return (
      <>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
            <Users size={18} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-3xl font-semibold tracking-tight">{stats.today}</p>
          <p className="mt-1 text-sm font-medium">Bugünkü ziyaretçi</p>
          <p className="mt-1.5 text-xs text-muted-foreground">İstanbul saatine göre</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Activity size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-3xl font-semibold tracking-tight">{stats.online}</p>
          </div>
          <p className="mt-1 text-sm font-medium">Şu an online</p>
          <p className="mt-1.5 text-xs text-muted-foreground">Yaklaşık 30 sn içinde yenilenir</p>
        </div>
      </>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground sm:justify-end">
      <span className="inline-flex items-center gap-1.5">
        <Users size={13} className="text-primary" />
        Bugün <strong className="font-medium text-foreground">{stats.today}</strong> ziyaretçi
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
        <strong className="font-medium text-foreground">{stats.online}</strong> online
      </span>
    </div>
  );
}
