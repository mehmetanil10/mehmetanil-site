import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ONLINE_WINDOW_MS = 90_000;
const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{20,80}$/;

function todayInIstanbul() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function hashVisitorId(visitorId: string) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("Analytics hashing secret is not configured.");
  }

  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

async function getStats() {
  const onlineSince = new Date(Date.now() - ONLINE_WINDOW_MS);
  const [today, online] = await Promise.all([
    prisma.dailyVisitor.count({ where: { date: todayInIstanbul() } }),
    prisma.activeVisitor.count({ where: { lastSeenAt: { gte: onlineSince } } }),
  ]);

  return { today, online };
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
    const body = (await request.json()) as { visitorId?: unknown };

    if (
      typeof body.visitorId !== "string" ||
      !VISITOR_ID_PATTERN.test(body.visitorId)
    ) {
      return NextResponse.json({ error: "Geçersiz ziyaretçi kimliği." }, { status: 400 });
    }

    const now = new Date();
    const visitorHash = hashVisitorId(body.visitorId);
    const date = todayInIstanbul();

    await prisma.$transaction([
      prisma.dailyVisitor.upsert({
        where: { date_visitorHash: { date, visitorHash } },
        create: { date, visitorHash, firstSeenAt: now },
        update: { lastSeenAt: now },
      }),
      prisma.activeVisitor.upsert({
        where: { visitorHash },
        create: { visitorHash, createdAt: now },
        update: { lastSeenAt: now },
      }),
    ]);

    const stats = await getStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Analytics heartbeat error:", error);
    return NextResponse.json({ error: "Ziyaret kaydedilemedi." }, { status: 500 });
  }
}
