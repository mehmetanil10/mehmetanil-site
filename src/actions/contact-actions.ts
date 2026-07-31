"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import type { ContactFormValues } from "@/lib/validations";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_MESSAGES = 3;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ERROR =
  "İnsan doğrulaması başarısız oldu. Lütfen tekrar deneyin.";

type TurnstileVerification = {
  success?: boolean;
  "error-codes"?: string[];
};

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

async function verifyTurnstile(token: string, remoteIp: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY is not configured.");
    return false;
  }

  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp !== "unknown") body.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) return false;

    const result = (await response.json()) as TurnstileVerification;
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification request failed:", error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitContact(
  data: ContactFormValues,
  turnstileToken: string,
) {
  const validated = contactSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const clientIp = getClientIp();
  const turnstileVerified = await verifyTurnstile(turnstileToken, clientIp);

  if (!turnstileVerified) {
    return { error: TURNSTILE_ERROR };
  }

  const { website, ...messageData } = validated.data;

  // Botların honeypot kontrolünü keşfetmemesi için başarılı gibi yanıt ver.
  if (website) {
    return { success: true };
  }

  const ipHash = hashIp(clientIp);
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
