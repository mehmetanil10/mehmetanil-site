"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import type { ContactFormValues } from "@/lib/validations";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_MESSAGES = 3;

function getClientIp() {
  const requestHeaders = headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

function hashIp(ip: string) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Auth secret is required for contact rate limiting.");
  }

  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

export async function submitContact(data: ContactFormValues) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { website, ...messageData } = validated.data;

  // Botların honeypot kontrolünü keşfetmemesi için başarılı gibi yanıt ver.
  if (website) {
    return { success: true };
  }

  const ipHash = hashIp(getClientIp());
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentMessageCount = await prisma.contactMessage.count({
    where: {
      ipHash,
      createdAt: { gte: windowStart },
    },
  });

  if (recentMessageCount >= RATE_LIMIT_MAX_MESSAGES) {
    return {
      error: "Çok fazla mesaj gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.",
    };
  }

  await prisma.contactMessage.create({
    data: { ...messageData, ipHash },
  });
  return { success: true };
}
