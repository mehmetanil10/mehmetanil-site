import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  try {
    const stats = await getAnalyticsSummary();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Admin analytics summary error:", error);
    return NextResponse.json(
      { error: "İstatistikler alınamadı." },
      { status: 500 },
    );
  }
}
