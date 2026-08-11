import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ONLINE_WINDOW_MS = 90_000;
const PRESENCE_ID = "admin";

export async function GET() {
  try {
    const presence = await prisma.adminPresence.findUnique({
      where: { id: PRESENCE_ID },
      select: { lastSeenAt: true },
    });
    const online = Boolean(
      presence && presence.lastSeenAt.getTime() >= Date.now() - ONLINE_WINDOW_MS,
    );

    return NextResponse.json(
      { online },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Admin presence read failed:", error);
    return NextResponse.json(
      { online: false },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}

export async function POST() {
  try {
    await requireAdmin();
    const now = new Date();

    await prisma.adminPresence.upsert({
      where: { id: PRESENCE_ID },
      create: { id: PRESENCE_ID, createdAt: now },
      update: { lastSeenAt: now },
    });

    return NextResponse.json(
      { online: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }
}
