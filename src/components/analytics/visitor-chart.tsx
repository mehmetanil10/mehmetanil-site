"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DailyVisitorPoint = {
  date: string;
  count: number;
};

type VisitorChartProps = {
  data: DailyVisitorPoint[];
};

const ranges = [7, 14, 30] as const;

function formatDate(date: string, withMonth = false) {
  const [, month, day] = date.split("-");
  return withMonth ? `${day}.${month}` : day;
}

export function VisitorChart({ data }: VisitorChartProps) {
  const [range, setRange] = useState<(typeof ranges)[number]>(14);
  const visibleData = useMemo(() => data.slice(-range), [data, range]);
  const maxCount = Math.max(1, ...visibleData.map((item) => item.count));
  const total = visibleData.reduce((sum, item) => sum + item.count, 0);
  const average = visibleData.length ? total / visibleData.length : 0;

  return (
    <section className="mt-6 rounded-xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="font-semibold">Günlük ziyaretçiler</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Benzersiz ziyaretçi sayısının günlere göre dağılımı
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border/50 bg-background/50 p-1">
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
              {item} gün
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-b border-border/30 pb-5 sm:flex sm:gap-8">
        <div>
          <p className="text-2xl font-semibold">{total}</p>
          <p className="text-xs text-muted-foreground">Dönem toplamı</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{average.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Günlük ortalama</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{maxCount === 1 && total === 0 ? 0 : maxCount}</p>
          <p className="text-xs text-muted-foreground">En yüksek gün</p>
        </div>
      </div>

      <div className="mt-6 flex h-64 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Son ${range} günün ziyaretçi grafiği`}>
        {visibleData.map((item, index) => {
          const height = item.count === 0 ? 2 : Math.max(8, (item.count / maxCount) * 100);
          const showLabel =
            index === 0 ||
            index === visibleData.length - 1 ||
            index % (range === 30 ? 5 : range === 14 ? 2 : 1) === 0;

          return (
            <div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="relative flex flex-1 items-end">
                <div
                  className="w-full rounded-t bg-primary/70 transition-all duration-300 hover:bg-primary"
                  style={{ height: `${height}%` }}
                  title={`${formatDate(item.date, true)}: ${item.count} ziyaretçi`}
                />
                <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-[10px] text-popover-foreground shadow group-hover:block">
                  {item.count}
                </span>
              </div>
              <span className="mt-2 h-4 text-center text-[10px] text-muted-foreground">
                {showLabel ? formatDate(item.date, range > 14) : ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
