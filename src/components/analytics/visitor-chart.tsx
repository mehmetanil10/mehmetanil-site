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
  title?: string;
  description?: string;
  valueLabel?: string;
};

const ranges = [7, 14, 30, "all"] as const;
type ChartRange = (typeof ranges)[number];

function formatDate(date: string, withMonth = false) {
  const [, month, day] = date.split("-");
  return withMonth ? `${day}.${month}` : day;
}

export function VisitorChart({
  data,
  title = "Günlük ziyaretçiler",
  description = "Benzersiz ziyaretçi sayısının günlere göre dağılımı",
  valueLabel = "ziyaretçi",
}: VisitorChartProps) {
  const [range, setRange] = useState<ChartRange>(14);
  const visibleData = useMemo(
    () => (range === "all" ? data : data.slice(-range)),
    [data, range],
  );
  const maxCount = Math.max(1, ...visibleData.map((item) => item.count));
  const total = visibleData.reduce((sum, item) => sum + item.count, 0);
  const average = visibleData.length ? total / visibleData.length : 0;
  const labelStep = Math.max(1, Math.ceil(visibleData.length / 8));
  const chartMinWidth =
    range === "all" && visibleData.length > 30
      ? `${visibleData.length * 18}px`
      : "100%";

  return (
    <section className="mt-6 min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="font-semibold">{title}</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="grid w-full grid-cols-2 gap-1 self-start rounded-md border border-border/50 bg-background/50 p-1 sm:flex sm:w-auto sm:items-center">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={cn(
                "whitespace-nowrap rounded px-2.5 py-1 text-xs transition-colors",
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
          <p className="text-2xl font-semibold">
            {maxCount === 1 && total === 0 ? 0 : maxCount}
          </p>
          <p className="text-xs text-muted-foreground">En yüksek gün</p>
        </div>
      </div>

      <div className="mt-6 max-w-full overflow-x-auto overscroll-x-contain pb-2">
        <div
          className="flex h-64 items-end gap-1.5 sm:gap-2"
          style={{ minWidth: chartMinWidth }}
          role="img"
          aria-label={`${title}: ${range === "all" ? "tüm zamanlar" : `son ${range} gün`}`}
        >
          {visibleData.map((item, index) => {
            const height =
              item.count === 0 ? 2 : Math.max(8, (item.count / maxCount) * 100);
            const showLabel =
              index === 0 ||
              index === visibleData.length - 1 ||
              index % labelStep === 0;

            return (
              <div
                key={item.date}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <div className="flex flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-primary/70 transition-all duration-300 hover:bg-primary"
                    style={{ height: `${height}%` }}
                    title={`${formatDate(item.date, true)}: ${item.count} ${valueLabel}`}
                  />
                </div>
                <span className="mt-2 h-4 text-center text-[10px] text-muted-foreground">
                  {showLabel ? formatDate(item.date, visibleData.length > 14) : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
