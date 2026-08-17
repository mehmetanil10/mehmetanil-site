import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Inbox,
  Tag,
  Trophy,
} from "lucide-react";
import { VisitorStats } from "@/components/analytics/visitor-stats";
import {
  VisitorChart,
  type DailyVisitorPoint,
} from "@/components/analytics/visitor-chart";
import {
  CvViewChart,
  type DailyCvViewPoint,
} from "@/components/analytics/cv-view-chart";
import {
  PageAnalytics,
  type DailyPageMetric,
  type DailySourceMetric,
} from "@/components/analytics/page-analytics";

type DailyCountRow = {
  date: string;
  count: number;
};

type DailyCvCountRow = {
  date: string;
  language: string;
  count: number;
};

type DailyPageMetricRow = {
  date: string;
  path: string;
  views: number;
  visitors: number;
};

type DailySourceMetricRow = {
  date: string;
  source: string;
  visitors: number;
};

const pageLabels: Record<string, string> = {
  "/": "Ana Sayfa",
  "/about": "Hakkımda",
  "/experience": "Deneyim",
  "/projects": "Projeler",
  "/services": "Hizmetler",
  "/blog": "Blog",
  "/contact": "İletişim",
};

function getPageLabel(
  path: string,
  posts: Array<{ slug: string; title: string }>,
) {
  if (pageLabels[path]) return pageLabels[path];
  if (path.startsWith("/blog/")) {
    const slug = path.slice("/blog/".length);
    return posts.find((post) => post.slug === slug)?.title ?? "Blog yazısı";
  }
  return path
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/[-_]/g, " ") ?? "Bilinmeyen sayfa";
}

function dateInIstanbul(daysAgo = 0) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() - daysAgo * 86_400_000));
}

function formatLastVisit(date: Date) {
  const visitDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const time = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (visitDate === dateInIstanbul()) return `Bugün ${time}`;
  if (visitDate === dateInIstanbul(1)) return `Dün ${time}`;

  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function fillDailySeries(rows: DailyCountRow[]): DailyVisitorPoint[] {
  const counts = new Map(rows.map((item) => [item.date, Number(item.count)]));
  const defaultStart = dateInIstanbul(29);
  const firstRecordedDate = rows[0]?.date;
  const startDate =
    firstRecordedDate && firstRecordedDate < defaultStart
      ? firstRecordedDate
      : defaultStart;
  const endDate = dateInIstanbul();
  const cursor = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  const result: DailyVisitorPoint[] = [];

  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    result.push({ date, count: counts.get(date) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

function fillDailyCvSeries(rows: DailyCvCountRow[]): DailyCvViewPoint[] {
  const counts = new Map<string, { tr: number; en: number }>();

  for (const row of rows) {
    const current = counts.get(row.date) ?? { tr: 0, en: 0 };
    if (row.language === "TR") current.tr += Number(row.count);
    if (row.language === "EN") current.en += Number(row.count);
    counts.set(row.date, current);
  }

  const defaultStart = dateInIstanbul(29);
  const firstRecordedDate = rows[0]?.date;
  const startDate =
    firstRecordedDate && firstRecordedDate < defaultStart
      ? firstRecordedDate
      : defaultStart;
  const endDate = dateInIstanbul();
  const cursor = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  const result: DailyCvViewPoint[] = [];

  while (cursor <= end) {
    const date = cursor.toISOString().slice(0, 10);
    const day = counts.get(date) ?? { tr: 0, en: 0 };
    result.push({ date, tr: day.tr, en: day.en });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

async function getStats() {
  const [
    totalPosts,
    published,
    drafts,
    categories,
    messages,
    dailyVisitors,
    dailyPostViews,
    dailyCvViews,
    postsWithViews,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.dailyVisitor.groupBy({
      by: ["date"],
      _count: { _all: true },
      orderBy: { date: "asc" },
    }),
    prisma.$queryRaw<DailyCountRow[]>`
      SELECT
        TO_CHAR("createdAt" AT TIME ZONE 'Europe/Istanbul', 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM "PostView"
      GROUP BY 1
      ORDER BY 1 ASC
    `,
    prisma.cvView.groupBy({
      by: ["date", "language"],
      _count: { _all: true },
      orderBy: { date: "asc" },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { views: true } },
      },
      orderBy: { views: { _count: "desc" } },
    }),
  ]);

  let dailyPageMetrics: DailyPageMetricRow[] = [];
  let dailySourceMetrics: DailySourceMetricRow[] = [];
  let lastPageView: { path: string; createdAt: Date } | null = null;

  try {
    [dailyPageMetrics, dailySourceMetrics, lastPageView] = await Promise.all([
      prisma.$queryRaw<DailyPageMetricRow[]>`
        SELECT
          "date",
          "path",
          COUNT(*)::int AS views,
          COUNT(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView"
        GROUP BY "date", "path"
        ORDER BY "date" ASC, views DESC
      `,
      prisma.$queryRaw<DailySourceMetricRow[]>`
        SELECT
          "date",
          "source",
          COUNT(DISTINCT "visitorHash")::int AS visitors
        FROM "PageView"
        GROUP BY "date", "source"
        ORDER BY "date" ASC, visitors DESC
      `,
      prisma.pageView.findFirst({
        orderBy: { createdAt: "desc" },
        select: { path: true, createdAt: true },
      }),
    ]);
  } catch (error) {
    console.error("Page analytics dashboard query failed:", error);
  }

  const cvViewRows = dailyCvViews.map((item) => ({
    date: item.date,
    language: item.language,
    count: item._count._all,
  }));
  const cvViewChartData = fillDailyCvSeries(cvViewRows);
  const totalTr = cvViewRows
    .filter((item) => item.language === "TR")
    .reduce((sum, item) => sum + item.count, 0);
  const totalEn = cvViewRows
    .filter((item) => item.language === "EN")
    .reduce((sum, item) => sum + item.count, 0);
  const todayCv = cvViewChartData.at(-1);
  const pageData: DailyPageMetric[] = dailyPageMetrics.map((item) => ({
    date: item.date,
    path: item.path,
    label: getPageLabel(item.path, postsWithViews),
    views: Number(item.views),
    visitors: Number(item.visitors),
  }));
  const sourceData: DailySourceMetric[] = dailySourceMetrics.map((item) => ({
    date: item.date,
    source: item.source,
    visitors: Number(item.visitors),
  }));

  return {
    totalPosts,
    published,
    drafts,
    categories,
    messages,
    visitorChartData: fillDailySeries(
      dailyVisitors.map((item) => ({
        date: item.date,
        count: item._count._all,
      })),
    ),
    postViewChartData: fillDailySeries(dailyPostViews),
    cvViewChartData,
    cvViews: {
      today: (todayCv?.tr ?? 0) + (todayCv?.en ?? 0),
      total: totalTr + totalEn,
      totalTr,
      totalEn,
    },
    pageData,
    sourceData,
    lastVisit: lastPageView
      ? {
          when: formatLastVisit(lastPageView.createdAt),
          page: getPageLabel(lastPageView.path, postsWithViews),
        }
      : null,
    popularPosts: postsWithViews.slice(0, 5),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Toplam yazı", value: stats.totalPosts, icon: FileText, color: "text-blue-600 dark:text-blue-400" },
    { label: "Yayında", value: stats.published, icon: BookOpen, color: "text-green-600 dark:text-green-400" },
    { label: "Taslak", value: stats.drafts, icon: FileText, color: "text-amber-600 dark:text-yellow-400" },
    { label: "Kategori", value: stats.categories, icon: Tag, color: "text-purple-600 dark:text-purple-400" },
  ];
  const todayVisitors = stats.visitorChartData.at(-1)?.count ?? 0;

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {stats.messages > 0
            ? `Bugün ${todayVisitors} ziyaretçiniz ve ${stats.messages} okunmamış mesajınız var.`
            : `Her şey yolunda. Bugün ${todayVisitors} ziyaretçi sitenizi görüntüledi.`}
        </p>
      </div>

      {/* Öncelikli durum alanı */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/messages"
          className={`group relative overflow-hidden rounded-xl border p-6 transition-all sm:col-span-2 ${
            stats.messages > 0
              ? "border-primary/25 bg-primary/[0.045] hover:border-primary/45"
              : "border-border/50 bg-card hover:border-border"
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                {stats.messages > 0 ? <Inbox size={19} /> : <CheckCircle2 size={19} />}
              </div>
              <ArrowRight
                size={17}
                className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight">{stats.messages}</p>
              <p className="mt-1 text-sm font-medium">
                {stats.messages > 0 ? "Okunmamış mesaj" : "Tüm mesajlar okundu"}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {stats.messages > 0
                  ? "Yeni mesajları görüntülemek için açın."
                  : "Şu anda ilgilenmeniz gereken yeni mesaj yok."}
              </p>
            </div>
          </div>
        </Link>

        <VisitorStats variant="cards" lastVisit={stats.lastVisit} />
      </div>

      {/* İkincil içerik istatistikleri */}
      <section className="mt-6">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          İçerik özeti
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/70 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary/70">
                <card.icon size={15} className={card.color} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold leading-none">{card.value}</p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Birincil grafik */}
      <VisitorChart data={stats.visitorChartData} />

      <PageAnalytics
        pageData={stats.pageData}
        sourceData={stats.sourceData}
        today={dateInIstanbul()}
      />

      <CvViewChart
        data={stats.cvViewChartData}
        today={stats.cvViews.today}
        total={stats.cvViews.total}
        totalTr={stats.cvViews.totalTr}
        totalEn={stats.cvViews.totalEn}
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <section className="mt-6 min-w-0 overflow-hidden rounded-xl border border-border/50 bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-600 dark:text-yellow-400" />
            <h2 className="font-semibold">En çok okunan blog yazıları</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tüm zamanların benzersiz görüntüleme sıralaması
          </p>

          <div className="mt-5 divide-y divide-border/30">
            {stats.popularPosts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Henüz görüntülenen bir yazı yok.
              </p>
            ) : (
              stats.popularPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex min-w-0 items-start gap-3 py-3 transition-colors hover:text-primary sm:items-center sm:gap-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-medium sm:truncate">
                      {post.title}
                    </span>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground sm:hidden">
                      <Eye size={12} /> {post._count.views} görüntüleme
                    </span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
                    <Eye size={13} /> {post._count.views} görüntüleme
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <VisitorChart
          data={stats.postViewChartData}
          title="Günlük blog görüntülemeleri"
          description="Yazıların benzersiz görüntülenme sayısının günlere göre dağılımı"
          valueLabel="görüntüleme"
        />
      </div>
    </div>
  );
}
