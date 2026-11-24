import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { markAsRead, setMessageReplied } from "@/actions/message-actions";
import { Mail, MailOpen } from "lucide-react";

const filters = { all: "Tümü", waiting: "Yanıt bekliyor", replied: "Yanıtlandı" } as const;

export default async function AdminMessagesPage({ searchParams }: { searchParams: { durum?: string } }) {
  const filter = searchParams.durum === "waiting" || searchParams.durum === "replied" ? searchParams.durum : "all";
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const visibleMessages = messages.filter((msg) => filter === "all" || msg.isReplied === (filter === "replied"));

  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3 sm:mb-8">
        <h1 className="text-xl font-semibold">Mesajlar</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary">
            {unreadCount} okunmamış
          </span>
        )}
      </div>

      <nav aria-label="Yanıt durumu" className="mb-5 flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, label]) => (
          <Link key={key} href={key === "all" ? "/admin/messages" : `/admin/messages?durum=${key}`}
            aria-current={filter === key ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-xs ${filter === key ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-3">
        {visibleMessages.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">{filter === "all" ? "Henüz mesaj yok." : "Bu durumda mesaj yok."}</p>
          </div>
        ) : (
          visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`min-w-0 overflow-hidden rounded-lg border bg-card p-4 transition-colors sm:p-5 ${
                msg.isRead
                  ? "border-border/30 opacity-70"
                  : "border-primary/25 bg-gradient-to-br from-primary/[0.035] via-card to-card"
              }`}
            >
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {msg.isRead ? (
                      <MailOpen size={16} className="text-muted-foreground" />
                    ) : (
                      <Mail size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-medium">{msg.name}</span>
                        <span className="rounded-full bg-secondary px-2 py-1 text-[11px]">{msg.isReplied ? "Yanıtlandı" : "Yanıt bekliyor"}</span>
                        {!msg.isRead ? (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                            Yeni
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 flex min-w-0 flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
                        <span className="break-all">{msg.email}</span>
                        {msg.subject && (
                          <>
                            <span className="hidden text-muted-foreground sm:inline">·</span>
                            <span className="break-words">
                              {msg.subject}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 border-t border-border/50 pt-3 sm:items-end sm:border-t-0 sm:pt-0">
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </span>
                  <a href={`mailto:${encodeURIComponent(msg.email).replace("%40", "@")}?subject=${encodeURIComponent("Re: " + (msg.subject || "İletişim mesajınız"))}`}
                    className="rounded-md bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground">
                    Yanıtla
                  </a>
                  <form action={setMessageReplied.bind(null, msg.id, !msg.isReplied)}>
                    <button type="submit" className="w-full rounded-md border px-3 py-2 text-xs">
                      {msg.isReplied ? "Yanıt bekliyor olarak işaretle" : "Yanıtlandı olarak işaretle"}
                    </button>
                  </form>
                  {!msg.isRead && (
                    <form
                      action={async () => {
                        "use server";
                        await markAsRead(msg.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="min-h-10 w-full rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground sm:min-h-0 sm:w-auto sm:py-1.5"
                      >
                        Okundu işaretle
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
