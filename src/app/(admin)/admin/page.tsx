import { prisma } from "@/lib/db";
import { FileText, BookOpen, Tag, Inbox } from "lucide-react";
import { VisitorStats } from "@/components/analytics/visitor-stats";

async function getStats() {
  const [totalPosts, published, drafts, categories, messages] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  return { totalPosts, published, drafts, categories, messages };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Toplam yazı", value: stats.totalPosts, icon: FileText, color: "text-blue-400" },
    { label: "Yayında", value: stats.published, icon: BookOpen, color: "text-green-400" },
    { label: "Taslak", value: stats.drafts, icon: FileText, color: "text-yellow-400" },
    { label: "Kategori", value: stats.categories, icon: Tag, color: "text-purple-400" },
    { label: "Okunmamış mesaj", value: stats.messages, icon: Inbox, color: "text-red-400" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border/50 bg-card p-5"
          >
            <card.icon size={18} className={`${card.color} mb-3`} />
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
        <VisitorStats variant="cards" />
      </div>
    </div>
  );
}
