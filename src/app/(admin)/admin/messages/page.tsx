import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { markAsRead } from "@/actions/message-actions";
import { Mail, MailOpen } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-xl font-semibold">Mesajlar</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-primary/10 text-primary text-xs font-mono px-2.5 py-0.5">
            {unreadCount} okunmamış
          </span>
        )}
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">Henüz mesaj yok.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg border bg-card p-5 transition-colors ${
                msg.isRead ? "border-border/30 opacity-60" : "border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {msg.isRead ? (
                      <MailOpen size={16} className="text-muted-foreground" />
                    ) : (
                      <Mail size={16} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{msg.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {msg.email}
                      </span>
                      {msg.subject && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.subject}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </span>
                  {!msg.isRead && (
                    <form
                      action={async () => {
                        "use server";
                        await markAsRead(msg.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs text-muted-foreground hover:text-foreground border border-border/50 rounded px-2 py-1 transition-colors"
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
