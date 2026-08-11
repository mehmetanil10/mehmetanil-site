import "server-only";

const TELEGRAM_TIMEOUT_MS = 6_000;
const PRODUCTION_URL = "https://mehmetanil-site.vercel.app";

function getSiteUrl() {
  const configured = process.env.NEXTAUTH_URL?.trim().replace(/\/+$/, "");
  return configured?.startsWith("https://") ? configured : PRODUCTION_URL;
}

export function getAdminUrl(path = "/admin") {
  return `${getSiteUrl()}${path}`;
}

export function notificationLine(value: string | null | undefined, maxLength = 100) {
  const normalized = value?.replace(/\s+/g, " ").trim() || "Belirtilmedi";
  return normalized.slice(0, maxLength);
}

export function isTelegramConfigured() {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN?.trim() &&
      process.env.TELEGRAM_CHAT_ID?.trim(),
  );
}

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    console.warn("Telegram notification variables are not configured.");
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error("Telegram notification failed with status:", response.status);
      return false;
    }

    const result = (await response.json()) as { ok?: boolean };
    return result.ok === true;
  } catch {
    // İstek URL'sindeki bot tokenının sunucu loglarına sızmasını engelle.
    console.error("Telegram notification request failed.");
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
