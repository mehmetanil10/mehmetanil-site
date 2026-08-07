import { createHmac, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VISITOR_COOKIE = "mehmetanil-cv-visitor";
const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{20,80}$/;
const CV_FILES = {
  tr: "/cv/Mehmet_Anil_CV_TR.pdf",
  en: "/cv/Mehmet_Anil_CV_EN.pdf",
} as const;

type CvLanguage = keyof typeof CV_FILES;

function dateInIstanbul() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function hashVisitorId(visitorId: string) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("CV analytics hashing secret is not configured.");
  return createHmac("sha256", secret).update(visitorId).digest("hex");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { language: string } },
) {
  const language = params.language.toLowerCase() as CvLanguage;

  if (!(language in CV_FILES)) {
    return NextResponse.json({ error: "CV bulunamadı." }, { status: 404 });
  }

  const storedVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorId =
    storedVisitorId && VISITOR_ID_PATTERN.test(storedVisitorId)
      ? storedVisitorId
      : randomUUID();
  const date = dateInIstanbul();

  try {
    const visitorHash = hashVisitorId(visitorId);
    await prisma.cvView.upsert({
      where: {
        date_language_visitorHash: {
          date,
          language: language.toUpperCase(),
          visitorHash,
        },
      },
      create: {
        date,
        language: language.toUpperCase(),
        visitorHash,
      },
      update: {},
    });
  } catch (error) {
    // Analytics failure must never prevent the visitor from opening the CV.
    console.error("CV view tracking error:", error);
  }

  const response = NextResponse.redirect(new URL(CV_FILES[language], request.url), 307);
  response.headers.set("Cache-Control", "no-store, max-age=0");

  if (visitorId !== storedVisitorId) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}
