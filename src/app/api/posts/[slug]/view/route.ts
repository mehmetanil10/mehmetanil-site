import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{20,80}$/;

function hashVisitorId(visitorId: string) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret) throw new Error("View hashing secret is not configured.");

  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const body = (await request.json()) as { visitorId?: unknown };

    if (
      typeof body.visitorId !== "string" ||
      !VISITOR_ID_PATTERN.test(body.visitorId)
    ) {
      return NextResponse.json({ error: "Geçersiz ziyaretçi kimliği." }, { status: 400 });
    }

    const post = await prisma.post.findFirst({
      where: { slug: params.slug, status: "PUBLISHED" },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });
    }

    const visitorHash = hashVisitorId(body.visitorId);

    await prisma.postView.upsert({
      where: { postId_visitorHash: { postId: post.id, visitorHash } },
      create: { postId: post.id, visitorHash },
      update: {},
    });

    const count = await prisma.postView.count({ where: { postId: post.id } });

    return NextResponse.json(
      { count },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Post view error:", error);
    return NextResponse.json({ error: "Görüntüleme kaydedilemedi." }, { status: 500 });
  }
}
