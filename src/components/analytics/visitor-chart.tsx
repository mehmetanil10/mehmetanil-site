import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DailyVisitorPoint = {
  date: string;
  count: number;
};

type VisitorChartProps = {
  data: DailyVisitorPoint[];
  today: string;
  totalLabel?: string;
  title?: string;
  description?: string;
  valueLabel?: string;
};

const shortDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const number = new Intl.NumberFormat("tr-TR");
const mean = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function VisitorChart({
  data,
  today,
  totalLabel = "Günlük sayıların toplamı",
  title = "Günlük ziyaretçiler",
  description = "Benzersiz ziyaretçi sayısının günlere göre dağılımı",
  valueLabel = "ziyaretçi",
}: VisitorChartProps) {
  const peakDay = data.reduce<DailyVisitorPoint | undefined>(
    (peak, day) => day.count > 0 && (!peak || day.count >= peak.count) ? day : peak,
    undefined,
  );
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const average = data.length ? total / data.length : 0;
  const spansYears = data[0]?.date.slice(0, 4) !== data.at(-1)?.date.slice(0, 4);
  function formatDate(date: string) {
    const label = shortDate.format(new Date(`${date}T12:00:00Z`));
    return spansYears ? `${label} ${date.slice(0, 4)}` : label;
  }

  return (
    <section className="mt-6 min-w-0 w-full max-w-full overflow-hidden rounded-xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="font-semibold">{title}</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 border-b border-border/30 pb-5 sm:flex sm:gap-8">
        <div>
          <p className="text-2xl font-semibold">{number.format(total)}</p>
          <p className="text-xs text-muted-foreground">{totalLabel}</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{mean.format(average)}</p>
          <p className="text-xs text-muted-foreground">Günlük ortalama</p>
        </div>
        <div className="col-span-2">
          <p className="text-xl font-semibold">
            {peakDay ? `${formatDate(peakDay.date)} · ${number.format(peakDay.count)} ${valueLabel}` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">En yüksek gün</p>
        </div>
      </div>

      <div className="mt-5 max-h-96 overflow-auto pb-2 sm:max-h-none">
        <ul aria-label={title} className="flex flex-col-reverse gap-1 sm:w-max sm:min-w-full sm:flex-row sm:gap-2">
          {data.map(({ date, count }) => {
            const isToday = date === today;
            const size = `${peakDay ? (count / peakDay.count) * 100 : 0}%`;
            return (
              <li key={date} className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-3 py-1 sm:flex sm:min-w-16 sm:flex-1 sm:flex-col sm:gap-2">
                <time dateTime={date} className={cn("text-xs sm:order-last sm:text-center", isToday ? "font-semibold text-primary" : "text-muted-foreground")}>
                  {formatDate(date)}
                  {isToday && <span className="ml-1 sm:ml-0 sm:block">Bugün</span>}
                </time>
                <div aria-hidden="true" className="h-2 overflow-hidden rounded bg-muted sm:hidden">
                  <div className={cn("h-full rounded", isToday ? "bg-primary" : "bg-primary/70")} style={{ width: size }} />
                </div>
                <div className="text-right sm:relative sm:mt-6 sm:h-36 sm:w-full sm:max-w-12">
                  <span className="text-sm font-semibold tabular-nums sm:absolute sm:left-1/2 sm:mb-1 sm:-translate-x-1/2" style={{ bottom: size }}>
                    {number.format(count)}<span className="sr-only"> {valueLabel}</span>
                  </span>
                  <div aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 hidden rounded-t sm:block", isToday ? "bg-primary" : "bg-primary/70")} style={{ height: size }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
