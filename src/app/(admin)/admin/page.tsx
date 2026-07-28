import Link from "next/link";
import { prisma } from "@/lib/db";
import { FileText, BookOpen, Tag, Inbox, Eye, Trophy } from "lucide-react";
import { VisitorStats } from "@/components/analytics/visitor-stats";
import {
  VisitorChart,
  type DailyVisitorPoint,
} from "@/components/analytics/visitor-chart";

type DailyCountRow = {
  date: string;
  count: number;
};

function dateInIstanbul(daysAgo = 0) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() - daysAgo * 86_400_000));
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

async function getStats() {
  const [
    totalPosts,
    published,
    drafts,
    categories,
    messages,
    dailyVisitors,
    dailyPostViews,
    popularPosts,
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
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: { select: { views: true } },
      },
      orderBy: { views: { _count: "desc" } },
      take: 5,
    }),
  ]);

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
    popularPosts,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Toplam yazı", value: stats.totalPosts, icon: FileText, color: "text-blue-400" },
    { label: "Yayında", value: stats.published, icon: BookOpen, color: "text-green-400" },
    { label: "Taslak", value: stats.drafts, icon: FileText, color: "text-yellow-400" },
    { label: "Kategori", value: stats.categories, icon: Tag, color: "text-purple-400" },
    { label: "Okunmamış mesaj", value: stats.messages, icon: Inbox, color: "text-red-400" },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-8 text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border/50 bg-card p-5"
          >
            <card.icon size={18} className={`${card.color} mb-3`} />
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
        <VisitorStats variant="cards" />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <VisitorChart data={stats.visitorChartData} />
        <VisitorChart
          data={stats.postViewChartData}
          title="Günlük blog görüntülemeleri"
          description="Yazıların benzersiz görüntülenme sayısının günlere göre dağılımı"
          valueLabel="görüntüleme"
        />
      </div>

      <section className="mt-6 rounded-xl border border-border/50 bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" />
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
                className="flex items-center gap-4 py-3 transition-colors hover:text-primary"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs text-muted-foreground">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {post.title}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye size={13} /> {post._count.views} görüntüleme
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
