"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, ArrowDownRight, ArrowUpRight, Minus, Users } from "lucide-react";
import { getVisitorId } from "@/lib/visitor-id";

type Stats = {
  today: number;
  yesterday: number;
  online: number;
  sevenDayAverage: number;
};

type VisitorStatsProps = {
  track?: boolean;
  variant?: "footer" | "cards";
};

const SOURCE_STORAGE_KEY = "mehmetanil-traffic-source";

function identifySource(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("github")) return "github";
  if (normalized.includes("google")) return "google";
  return null;
}

function getTrafficSource() {
  const utmSource = new URLSearchParams(window.location.search).get("utm_source");
  const identifiedUtm = utmSource ? identifySource(utmSource) : null;
  if (identifiedUtm) {
    window.sessionStorage.setItem(SOURCE_STORAGE_KEY, identifiedUtm);
    return identifiedUtm;
  }

  const stored = window.sessionStorage.getItem(SOURCE_STORAGE_KEY);
  if (stored) return stored;

  let source = identifiedUtm ?? "direct";

  if (!identifiedUtm && document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      if (referrer.hostname !== window.location.hostname) {
        source =
          identifySource(referrer.hostname) ??
          `other:${referrer.hostname.toLowerCase().replace(/[^a-z0-9.-]/g, "").slice(0, 64)}`;
      }
    } catch {
      source = "direct";
    }
  }

  window.sessionStorage.setItem(SOURCE_STORAGE_KEY, source);
  return source;
}

function comparisonText(today: number, yesterday: number) {
  if (today === yesterday) return { text: "Dünle aynı", direction: "same" as const };
  if (yesterday === 0) {
    return {
      text: `Düne göre +${today}`,
      direction: "up" as const,
    };
  }

  const percentage = Math.round(((today - yesterday) / yesterday) * 100);
  return {
    text: `Düne göre ${percentage > 0 ? "+" : ""}${percentage}%`,
    direction: percentage > 0 ? ("up" as const) : ("down" as const),
  };
}

export function VisitorStats({ track = false, variant = "footer" }: VisitorStatsProps) {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    today: 0,
    yesterday: 0,
    online: 0,
    sevenDayAverage: 0,
  });

  const refresh = useCallback(
    async (pageView = false) => {
      try {
        const response = await fetch("/api/analytics", {
          method: track ? "POST" : "GET",
          headers: track ? { "Content-Type": "application/json" } : undefined,
          body: track
            ? JSON.stringify({
                visitorId: getVisitorId(),
                pageView,
                path: pathname,
                source: getTrafficSource(),
              })
            : undefined,
          cache: "no-store",
          keepalive: track,
        });

        if (!response.ok) return;
        setStats((await response.json()) as Stats);
      } catch {
        // Sayaçlar sayfanın asıl içeriğini etkilememeli.
      }
    },
    [pathname, track],
  );

  useEffect(() => {
    const shouldTrackPage = track && trackedPath.current !== pathname;
    if (shouldTrackPage) trackedPath.current = pathname;
    void refresh(shouldTrackPage);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh(false);
    }, 30_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refresh(false);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pathname, refresh, track]);

  if (variant === "cards") {
    const comparison = comparisonText(stats.today, stats.yesterday);
    const ComparisonIcon =
      comparison.direction === "up"
        ? ArrowUpRight
        : comparison.direction === "down"
          ? ArrowDownRight
          : Minus;

    return (
      <>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Users size={18} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                comparison.direction === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : comparison.direction === "down"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
              }`}
            >
              <ComparisonIcon size={13} /> {comparison.text}
            </span>
          </div>
          <p className="text-3xl font-semibold tracking-tight">{stats.today}</p>
          <p className="mt-1 text-sm font-medium">Bugünkü ziyaretçi</p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Dün {stats.yesterday} · 7 günlük ort. {stats.sevenDayAverage.toFixed(1)}
          </p>
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
