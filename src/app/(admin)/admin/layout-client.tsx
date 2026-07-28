"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Tag, LogOut, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/messages/unread", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then((d) => setUnreadCount(d.count ?? 0))
      .catch(() => {});
  }, [pathname]);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/posts", label: "Yazılar", icon: FileText },
    { href: "/admin/categories", label: "Kategoriler", icon: Tag },
    {
      href: "/admin/messages",
      label: "Mesajlar",
      icon: Inbox,
      badge: unreadCount,
    },
  ];

  return (
    <aside className="w-56 border-r border-border/50 bg-card flex flex-col">
      <div className="p-5 border-b border-border/50">
        <Link href="/" className="font-mono text-sm text-primary">
          mehmetanil
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              <span className="flex items-center gap-2.5">
                <link.icon size={15} />
                {link.label}
              </span>
              {link.badge ? (
                <span className="rounded-full bg-primary/20 text-primary text-xs px-1.5 py-0.5 font-mono">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <Link
          href="/api/auth/signout"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={15} /> Çıkış yap
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
