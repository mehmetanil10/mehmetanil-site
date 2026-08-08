"use client";

import { useMemo, useState } from "react";
import { BarChart3, Compass, Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type DailyPageMetric = {
  date: string;
  path: string;
  label: string;
  views: number;
  visitors: number;
};

export type DailySourceMetric = {
  date: string;
  source: string;
  visitors: number;
};

type PageAnalyticsProps = {
  pageData: DailyPageMetric[];
  sourceData: DailySourceMetric[];
  today: string;
};

const ranges = [7, 30, "all"] as const;
type Range = (typeof ranges)[number];

function cutoffDate(today: string, range: Exclude<Range, "all">) {
  const date = new Date(`${today}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - range + 1);
  return date.toISOString().slice(0, 10);
}

function sourceLabel(source: string) {
  if (source === "direct") return "Doğrudan";
  if (source === "linkedin") return "LinkedIn";
  if (source === "github") return "GitHub";
  if (source === "google") return "Google";
  if (source.startsWith("other:")) return source.slice(6);
  return "Diğer";
}

export function PageAnalytics({ pageData, sourceData, today }: PageAnalyticsProps) {
  const [range, setRange] = useState<Range>(30);
  const cutoff = range === "all" ? null : cutoffDate(today, range);

  const pages = useMemo(() => {
    const totals = new Map<
      string,
      { path: string; label: string; views: number; visitors: number }
    >();

    for (const item of pageData) {
      if (cutoff && item.date < cutoff) continue;
      const current = totals.get(item.path) ?? {
        path: item.path,
        label: item.label,
        views: 0,
        visitors: 0,
      };
      current.views += item.views;
      current.visitors += item.visitors;
      totals.set(item.path, current);
    }

    return [...totals.values()]
      .sort((first, second) => second.views - first.views)
      .slice(0, 8);
  }, [cutoff, pageData]);

  const sources = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of sourceData) {
      if (cutoff && item.date < cutoff) continue;
      totals.set(item.source, (totals.get(item.source) ?? 0) + item.visitors);
    }

    return [...totals.entries()]
      .map(([source, visitors]) => ({ source, visitors }))
      .sort((first, second) => second.visitors - first.visitors);
  }, [cutoff, sourceData]);

  const sourceTotal = sources.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <section className="mt-6 min-w-0 rounded-xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="font-semibold">Sayfa ve trafik analizi</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Ziyaretçilerin hangi sayfalara ve hangi kaynaklardan ulaştığı
          </p>
        </div>

        <div className="flex items-center gap-1 self-start rounded-md border border-border/50 bg-background/50 p-1">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={cn(
                "rounded px-2.5 py-1 text-xs transition-colors",
                range === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item === "all" ? "Tümü" : `${item} gün`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 rounded-lg border border-border/40 bg-background/35 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold">En çok ziyaret edilen sayfalar</h3>
          </div>
          <div className="mt-4 divide-y divide-border/30">
            {pages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Bu dönem için henüz sayfa verisi yok.
              </p>
            ) : (
              pages.map((page, index) => (
                <div key={page.path} className="flex items-center gap-3 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px] text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{page.label}</p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      {page.path}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="inline-flex items-center gap-1 text-xs font-medium">
                      <Eye size={12} /> {page.views}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {page.visitors} günlük tekil
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border/40 bg-background/35 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold">Trafik kaynakları</h3>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Aynı kişinin günlük tekrarları tek ziyaret sayılır.
          </p>

          <div className="mt-5 space-y-4">
            {sources.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Bu dönem için henüz kaynak verisi yok.
              </p>
            ) : (
              sources.map((item) => {
                const share = sourceTotal ? (item.visitors / sourceTotal) * 100 : 0;
                return (
                  <div key={item.source}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-medium">{sourceLabel(item.source)}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {item.visitors} · %{Math.round(share)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-[width] duration-500"
                        style={{ width: `${Math.max(share, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
