import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function hasValidImageSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mimeType === "image/gif") {
    const signature = buffer.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  if (mimeType === "image/avif") {
    return (
      buffer.subarray(4, 8).toString("ascii") === "ftyp" &&
      ["avif", "avis"].includes(buffer.subarray(8, 12).toString("ascii"))
    );
  }

  return false;
}

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "blog-images";

  if (!supabaseUrl || !serviceKey) return null;
  if (!/^[a-z0-9_-]+$/i.test(bucket)) return null;

  return { supabaseUrl, serviceKey, bucket };
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storage = getStorageConfig();
  if (!storage) {
    return NextResponse.json(
      { error: "Supabase Storage yapılandırması eksik." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Görsel dosyası gerekli." }, { status: 400 });
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Yalnızca JPG, PNG, WebP, GIF veya AVIF yüklenebilir." },
      { status: 415 },
    );
  }

  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Görsel boyutu 5 MB'dan küçük olmalıdır." },
      { status: 413 },
    );
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidImageSignature(fileBuffer, file.type)) {
    return NextResponse.json(
      { error: "Dosya içeriği geçerli bir görsel değil." },
      { status: 415 },
    );
  }

  const now = new Date();
  const objectPath = [
    "posts",
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    `${randomUUID()}.${extension}`,
  ].join("/");
  const encodedObjectPath = objectPath
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  const uploadUrl = `${storage.supabaseUrl}/storage/v1/object/${encodeURIComponent(storage.bucket)}/${encodedObjectPath}`;
  const authHeaders: Record<string, string> = {
    apikey: storage.serviceKey,
  };

  // Yeni sb_secret anahtarları JWT değildir; legacy service_role ise Bearer ister.
  if (!storage.serviceKey.startsWith("sb_secret_")) {
    authHeaders.Authorization = `Bearer ${storage.serviceKey}`;
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "false",
    },
    body: fileBuffer,
  });

  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text();
    console.error("Supabase Storage upload failed:", uploadResponse.status, detail);
    return NextResponse.json(
      { error: "Görsel Supabase Storage'a yüklenemedi." },
      { status: 502 },
    );
  }

  const publicUrl = `${storage.supabaseUrl}/storage/v1/object/public/${encodeURIComponent(storage.bucket)}/${encodedObjectPath}`;

  return NextResponse.json(
    { url: publicUrl },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
