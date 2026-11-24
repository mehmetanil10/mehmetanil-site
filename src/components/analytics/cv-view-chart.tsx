import { FileText } from "lucide-react";

export type DailyCvViewPoint = {
  date: string;
  tr: number;
  en: number;
};

type CvViewChartProps = {
  data: DailyCvViewPoint[];
  today: number;
  total: number;
  totalTr: number;
  totalEn: number;
};

function formatDate(date: string, withMonth = false) {
  const [, month, day] = date.split("-");
  return withMonth ? `${day}.${month}` : day;
}

export function CvViewChart({
  data,
  today,
  total,
  totalTr,
  totalEn,
}: CvViewChartProps) {
  const dailyTotals = data.map((item) => item.tr + item.en);
  const maxCount = Math.max(1, ...dailyTotals);
  const labelStep = Math.max(1, Math.ceil(data.length / 8));
  const chartMinWidth =
    data.length > 30
      ? `${data.length * 18}px`
      : "100%";

  const summaryCards = [
    { label: "Bugün", value: today, tone: "text-primary" },
    { label: "Dönem toplamı", value: total, tone: "text-foreground" },
    { label: "Türkçe CV", value: totalTr, tone: "text-blue-600 dark:text-blue-400" },
    { label: "İngilizce CV", value: totalEn, tone: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <section className="mt-6 min-w-0 rounded-xl border border-border/50 bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h2 className="font-semibold">CV görüntülemeleri</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Türkçe ve İngilizce CV&apos;lerin günlük benzersiz açılma sayıları
          </p>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border/50 bg-background/45 p-4">
            <p className={`text-2xl font-semibold ${card.tone}`}>{card.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/30 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-500" /> TR
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-orange-500" /> EN
          </span>
        </div>

      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div
          className="flex h-64 items-end gap-1.5 sm:gap-2"
          style={{ minWidth: chartMinWidth }}
          role="img"
          aria-label="Seçili dönemde günlük CV görüntülemeleri"
        >
          {data.map((item, index) => {
            const totalForDay = item.tr + item.en;
            const height = totalForDay === 0 ? 2 : Math.max(8, (totalForDay / maxCount) * 100);
            const showLabel =
              index === 0 || index === data.length - 1 || index % labelStep === 0;

            return (
              <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                <div className="flex flex-1 items-end">
                  <div
                    className="flex w-full flex-col-reverse overflow-hidden rounded-t bg-border/35 transition-opacity hover:opacity-85"
                    style={{ height: `${height}%` }}
                    title={`${formatDate(item.date, true)}: ${totalForDay} görüntüleme (TR ${item.tr}, EN ${item.en})`}
                  >
                    {totalForDay > 0 && (
                      <>
                        <div
                          className="w-full bg-blue-500"
                          style={{ height: `${(item.tr / totalForDay) * 100}%` }}
                        />
                        <div
                          className="w-full bg-orange-500"
                          style={{ height: `${(item.en / totalForDay) * 100}%` }}
                        />
                      </>
                    )}
                  </div>
                </div>
                <span className="mt-2 h-4 text-center text-[10px] text-muted-foreground">
                  {showLabel ? formatDate(item.date, data.length > 14) : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
