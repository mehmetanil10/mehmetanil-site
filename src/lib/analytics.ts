import { prisma } from "@/lib/db";

export const ANALYTICS_ONLINE_WINDOW_MS = 90_000;

export function dateInIstanbul(daysAgo = 0) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() - daysAgo * 86_400_000));
}

export async function getPublicAnalyticsStats() {
  const onlineSince = new Date(Date.now() - ANALYTICS_ONLINE_WINDOW_MS);
  const [today, online] = await Promise.all([
    prisma.dailyVisitor.count({ where: { date: dateInIstanbul() } }),
    prisma.activeVisitor.count({ where: { lastSeenAt: { gte: onlineSince } } }),
  ]);

  return { today, online };
}

export async function getAnalyticsSummary() {
  const onlineSince = new Date(Date.now() - ANALYTICS_ONLINE_WINDOW_MS);
  const [today, yesterday, online, lastSevenDays] = await Promise.all([
    prisma.dailyVisitor.count({ where: { date: dateInIstanbul() } }),
    prisma.dailyVisitor.count({ where: { date: dateInIstanbul(1) } }),
    prisma.activeVisitor.count({ where: { lastSeenAt: { gte: onlineSince } } }),
    prisma.dailyVisitor.groupBy({
      by: ["date"],
      where: { date: { gte: dateInIstanbul(6) } },
      _count: { _all: true },
    }),
  ]);
  const sevenDayAverage =
    lastSevenDays.reduce((sum, day) => sum + day._count._all, 0) / 7;

  return { today, yesterday, online, sevenDayAverage };
}
