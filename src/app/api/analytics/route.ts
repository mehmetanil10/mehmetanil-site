import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ONLINE_WINDOW_MS = 90_000;
const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{20,80}$/;
const SOURCE_PATTERN = /^(direct|linkedin|github|google|other:[a-z0-9.-]{1,64})$/;

function dateInIstanbul(daysAgo = 0) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(Date.now() - daysAgo * 86_400_000));
}

function hashVisitorId(visitorId: string) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("Analytics hashing secret is not configured.");
  }

  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

function normalizePath(value: unknown) {
  if (typeof value !== "string" || value.length > 500) return null;

  try {
    const path = new URL(value, "https://mehmetanil-site.vercel.app").pathname;
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
      return null;
    }

    return path !== "/" ? path.replace(/\/+$/, "") : path;
  } catch {
    return null;
  }
}

function normalizeSource(value: unknown) {
  if (typeof value !== "string") return "direct";
  const source = value.toLowerCase().trim();
  return SOURCE_PATTERN.test(source) ? source : "direct";
}

async function getStats() {
  const onlineSince = new Date(Date.now() - ONLINE_WINDOW_MS);
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

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json({ error: "Sayaçlar alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visitorId?: unknown;
      path?: unknown;
      source?: unknown;
      pageView?: unknown;
    };

    if (
      typeof body.visitorId !== "string" ||
      !VISITOR_ID_PATTERN.test(body.visitorId)
    ) {
      return NextResponse.json({ error: "Geçersiz ziyaretçi kimliği." }, { status: 400 });
    }

    const now = new Date();
    const visitorHash = hashVisitorId(body.visitorId);
    const date = dateInIstanbul();
    const path = body.pageView === true ? normalizePath(body.path) : null;
    const source = normalizeSource(body.source);

    await prisma.$transaction(async (transaction) => {
      await transaction.dailyVisitor.upsert({
        where: { date_visitorHash: { date, visitorHash } },
        create: { date, visitorHash, firstSeenAt: now },
        update: { lastSeenAt: now },
      });
      await transaction.activeVisitor.upsert({
        where: { visitorHash },
        create: { visitorHash, createdAt: now },
        update: { lastSeenAt: now },
      });

    });

    if (path) {
      try {
        await prisma.pageView.create({
          data: { date, path, source, visitorHash, createdAt: now },
        });
      } catch (error) {
        // Sayfa analitiği geçici olarak yazılamasa da ana ziyaretçi sayacı çalışmalı.
        console.error("Page view analytics write failed:", error);
      }
    }

    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Analytics heartbeat error:", error);
    return NextResponse.json({ error: "Ziyaret kaydedilemedi." }, { status: 500 });
  }
}
