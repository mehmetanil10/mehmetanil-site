import { createHmac, timingSafeEqual } from "crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { dateInIstanbul, getPublicAnalyticsStats } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import {
  getAdminUrl,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{20,80}$/;
const SOURCE_PATTERN = /^(direct|linkedin|github|google|other:[a-z0-9.-]{1,64})$/;
const VISITOR_MILESTONES = [100, 50, 25, 10] as const;
const ANALYTICS_COOKIE = "mehmetanil-analytics-id";
const MAX_BODY_BYTES = 2_048;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 30;
const MAX_NEW_VISITORS_PER_IP_DAILY = 25;

function getAnalyticsSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("Analytics hashing secret is not configured.");
  }

  return secret;
}

function hmac(value: string) {
  return createHmac("sha256", getAnalyticsSecret()).update(value).digest("hex");
}

function hashVisitorId(visitorId: string) {
  return hmac(visitorId);
}

function getClientIp(request: NextRequest) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim();

  return ip || `local:${request.headers.get("host") ?? "unknown"}`;
}

function hashClientIp(request: NextRequest) {
  return hmac(`analytics-ip:${getClientIp(request)}`);
}

function signVisitorId(visitorId: string) {
  return hmac(`analytics-cookie:${visitorId}`);
}

function readSignedVisitorId(request: NextRequest) {
  const value = request.cookies.get(ANALYTICS_COOKIE)?.value;
  if (!value) return null;

  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;

  const visitorId = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!VISITOR_ID_PATTERN.test(visitorId) || !/^[a-f0-9]{64}$/.test(signature)) {
    return null;
  }

  const expected = signVisitorId(visitorId);
  const receivedBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
    ? visitorId
    : null;
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

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

async function consumeAnalyticsLimit(ipHash: string, issuesVisitor: boolean) {
  const now = new Date();
  const date = dateInIstanbul();

  return prisma.$transaction(async (transaction) => {
    const current = await transaction.analyticsRateLimit.findUnique({
      where: { ipHash },
    });
    const windowExpired =
      !current || now.getTime() - current.windowStartedAt.getTime() >= RATE_LIMIT_WINDOW_MS;
    const requestCount = windowExpired ? 1 : (current?.requestCount ?? 0) + 1;
    const issueDateChanged = !current || current.issueDate !== date;
    const issuedVisitorCount = issueDateChanged
      ? issuesVisitor
        ? 1
        : 0
      : (current?.issuedVisitorCount ?? 0) + (issuesVisitor ? 1 : 0);

    if (!windowExpired && (current?.requestCount ?? 0) >= RATE_LIMIT_REQUESTS) {
      const retryAfter = Math.max(
        1,
        Math.ceil(
          (RATE_LIMIT_WINDOW_MS -
            (now.getTime() - (current?.windowStartedAt.getTime() ?? now.getTime()))) /
            1_000,
        ),
      );
      return { allowed: false as const, retryAfter };
    }

    if (
      issuesVisitor &&
      !issueDateChanged &&
      (current?.issuedVisitorCount ?? 0) >= MAX_NEW_VISITORS_PER_IP_DAILY
    ) {
      return { allowed: false as const, retryAfter: 3_600 };
    }

    await transaction.analyticsRateLimit.upsert({
      where: { ipHash },
      create: {
        ipHash,
        windowStartedAt: now,
        requestCount,
        issueDate: date,
        issuedVisitorCount,
      },
      update: {
        windowStartedAt: windowExpired ? now : current?.windowStartedAt,
        requestCount,
        issueDate: date,
        issuedVisitorCount,
      },
    });

    return { allowed: true as const, retryAfter: 0 };
  });
}

async function notifyVisitorMilestone(date: string, visitorCount: number) {
  if (!isTelegramConfigured()) return;

  const threshold = VISITOR_MILESTONES.find((value) => visitorCount >= value);
  if (!threshold) return;

  const existing = await prisma.visitorMilestoneNotification.findUnique({
    where: { date_threshold: { date, threshold } },
    select: { id: true },
  });
  if (existing) return;

  let notificationId: string;
  try {
    const notification = await prisma.visitorMilestoneNotification.create({
      data: { date, threshold },
      select: { id: true },
    });
    notificationId = notification.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return;
    }
    console.error("Visitor milestone reservation failed:", error);
    return;
  }

  const formattedDate = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
  const sent = await sendTelegramMessage(
    [
      "🎯 Günlük ziyaretçi hedefi",
      "",
      `Bugün ${threshold} benzersiz ziyaretçiye ulaştınız.`,
      `Güncel sayı: ${visitorCount}`,
      `Tarih: ${formattedDate}`,
      "",
      `Dashboard: ${getAdminUrl("/admin")}`,
    ].join("\n"),
  );

  if (!sent) {
    await prisma.visitorMilestoneNotification
      .delete({ where: { id: notificationId } })
      .catch((error) => {
        console.error("Visitor milestone reservation cleanup failed:", error);
      });
  }
}

export async function GET() {
  try {
    const stats = await getPublicAnalyticsStats();
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json({ error: "Sayaçlar alınamadı." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (!contentType.startsWith("application/json")) {
      return NextResponse.json({ error: "Geçersiz içerik türü." }, { status: 415 });
    }
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "İstek gövdesi çok büyük." }, { status: 413 });
    }

    const body = (await request.json()) as {
      visitorId?: unknown;
      path?: unknown;
      source?: unknown;
      pageView?: unknown;
    };
    const signedVisitorId = readSignedVisitorId(request);
    const suppliedVisitorId =
      typeof body.visitorId === "string" && VISITOR_ID_PATTERN.test(body.visitorId)
        ? body.visitorId
        : null;
    const issuesVisitor = !signedVisitorId;
    const visitorId = signedVisitorId ?? suppliedVisitorId;

    if (!visitorId) {
      return NextResponse.json({ error: "Geçersiz ziyaretçi kimliği." }, { status: 400 });
    }

    const limit = await consumeAnalyticsLimit(hashClientIp(request), issuesVisitor);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderildi." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfter) },
        },
      );
    }

    const now = new Date();
    const visitorHash = hashVisitorId(visitorId);
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
        console.error("Page view analytics write failed:", error);
      }
    }

    const stats = await getPublicAnalyticsStats();
    await notifyVisitorMilestone(date, stats.today);
    const response = NextResponse.json(stats, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });

    if (issuesVisitor) {
      response.cookies.set({
        name: ANALYTICS_COOKIE,
        value: `${visitorId}.${signVisitorId(visitorId)}`,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error("Analytics heartbeat error:", error);
    return NextResponse.json({ error: "Ziyaret kaydedilemedi." }, { status: 500 });
  }
}
